// app/api/realtime/auth/route.js
import { Apinator } from '@apinator/server';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const realtime = new Apinator({
  appId: process.env.APINATOR_APP_ID,
  key: process.env.NEXT_PUBLIC_APINATOR_KEY,
  secret: process.env.APINATOR_SECRET,
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { socket_id, channel_name } = await req.json();

  // For presence channels, we attach the user's identity
  const auth = realtime.authenticateChannel(socket_id, channel_name, {
    user_id: session.user.id,
    user_info: {
      name: session.user.name,
      email: session.user.email,
      color: '#378ADD', // Or derive from a hash as you already do
    },
  });

  return NextResponse.json(auth);
}