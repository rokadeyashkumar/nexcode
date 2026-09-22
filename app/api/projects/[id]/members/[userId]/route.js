import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/projects/[id]/members/[userId] — update a member's role
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, userId } = await params;
  const { role } = await req.json();

  if (!['viewer', 'editor', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: { memberships: { where: { userId: session.user.id } } },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const isOwner = project.ownerId === session.user.id;
  const myRole = project.memberships[0]?.role;

  if (!isOwner && myRole !== 'admin') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const updated = await prisma.membership.update({
    where: {
      userId_projectId: { userId, projectId: id },
    },
    data: { role },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return NextResponse.json({
    id: updated.id,
    userId: updated.userId,
    role: updated.role,
    name: updated.user.name,
    email: updated.user.email,
    image: updated.user.image,
  });
}

// DELETE /api/projects/[id]/members/[userId] — remove a member
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, userId } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { memberships: { where: { userId: session.user.id } } },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const isOwner = project.ownerId === session.user.id;
  const myRole = project.memberships[0]?.role;

  // Owner can remove anyone; admin can remove non-admins; nobody can remove owner
  if (userId === project.ownerId) {
    return NextResponse.json({ error: 'Cannot remove the owner' }, { status: 400 });
  }

  if (!isOwner && myRole !== 'admin') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  await prisma.membership.delete({
    where: {
      userId_projectId: { userId, projectId: id },
    },
  });

  return NextResponse.json({ success: true });
}