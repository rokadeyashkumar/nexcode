import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/projects/[id]/members — list members
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Verify user has access
  const hasAccess = await prisma.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: session.user.id },
        { memberships: { some: { userId: session.user.id } } },
      ],
    },
  });

  if (!hasAccess) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const members = await prisma.membership.findMany({
    where: { projectId: id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { joinedAt: 'asc' },
  });

  return NextResponse.json(
    members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      name: m.user.name,
      email: m.user.email,
      image: m.user.image,
    }))
  );
}

// POST /api/projects/[id]/members — invite a user by email with a role
export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { email, role } = await req.json();

  if (!email || !role) {
    return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
  }

  if (!['viewer', 'editor', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  // Only owner or admin can invite
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      memberships: {
        where: { userId: session.user.id },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const isOwner = project.ownerId === session.user.id;
  const myRole = project.memberships[0]?.role;
  const canInvite = isOwner || myRole === 'admin';

  if (!canInvite) {
    return NextResponse.json(
      { error: 'Only the owner or an admin can invite members' },
      { status: 403 }
    );
  }

  // Find the user by email
  const invitee = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!invitee) {
    return NextResponse.json(
      { error: 'No NexCode user found with this email' },
      { status: 404 }
    );
  }

  if (invitee.id === project.ownerId) {
    return NextResponse.json(
      { error: 'This user is already the project owner' },
      { status: 400 }
    );
  }

  // Check if already a member
  const existing = await prisma.membership.findUnique({
    where: {
      userId_projectId: {
        userId: invitee.id,
        projectId: id,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: 'This user is already a member of this project' },
      { status: 409 }
    );
  }

  const membership = await prisma.membership.create({
    data: {
      userId: invitee.id,
      projectId: id,
      role,
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return NextResponse.json(
    {
      id: membership.id,
      userId: membership.userId,
      role: membership.role,
      name: membership.user.name,
      email: membership.user.email,
      image: membership.user.image,
    },
    { status: 201 }
  );
}