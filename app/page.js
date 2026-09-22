'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const CollabEditor = dynamic(
  () => import('./components/collab-editor/collab-editor'),
  { ssr: false }
);
const Dashboard = dynamic(
  () => import('./components/dashboard/dashboard'),
  { ssr: false }
);
const Website = dynamic(() => import('./website/page'), { ssr: false });

export default function Page() {
  const { data: session, status } = useSession();
  const [screen, setScreen] = useState('website');

  useEffect(() => {
    if (status === 'authenticated') {
      setScreen((current) => (current === 'website' ? 'dashboard' : current));
    }
    if (status === 'unauthenticated') {
      setScreen('website');
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#666',
      }}>
        Loading...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Website onNavigateToDashboard={() => {}} />;
  }

  if (screen === 'editor') {
    return (
      <CollabEditor
        user={session.user}
        onBackToDashboard={() => setScreen('dashboard')}
      />
    );
  }

  return (
    <Dashboard
      user={session.user}
      onOpenProject={() => setScreen('editor')}
    />
  );
}