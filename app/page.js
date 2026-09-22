'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for client-side only components
const CollabEditor = dynamic(() => import('./components/collab-editor/collab-editor'), { ssr: false });
const Dashboard = dynamic(() => import('./components/dashboard/dashboard'), { ssr: false });
const Website = dynamic(() => import('./website/page'), { ssr: false });

export default function Page() {
  const [screen, setScreen] = useState('website');

  const navigateToDashboard = () => {
    setScreen('dashboard');
  };

  const navigateToEditor = () => {
    setScreen('editor');
  };

  const navigateBackToDashboard = () => {
    setScreen('dashboard');
  };

  // Show website/landing page
  if (screen === 'website') {
    return <Website onNavigateToDashboard={navigateToDashboard} />;
  }

  // Show dashboard
  if (screen === 'dashboard') {
    return <Dashboard onOpenProject={navigateToEditor} />;
  }

  // Show editor
  if (screen === 'editor') {
    return <CollabEditor onBackToDashboard={navigateBackToDashboard} />;
  }

  return null;
}