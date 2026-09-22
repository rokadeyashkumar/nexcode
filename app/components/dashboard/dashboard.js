'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import styles from './dashboard.module.scss';
import Sidebar from './sidebar/sidebar';
import RecentView from './views/recent/recent';
import ProjectsView from './views/projects/projects';
import TeamsView from './views/teams/teams';
import PlannerView from './views/planner/planner';
import MeetingsView from './views/meetings/meetings';
import NotesView from './views/notes/notes';
import HelpView from './views/help/help';
import SettingsView from './views/settings/settings';
import ProfileView from './views/profile/profile';
import { useTheme } from '../../hooks/useTheme';

const VIEWS = {
  recent: RecentView,
  projects: ProjectsView,
  teams: TeamsView,
  planner: PlannerView,
  meetings: MeetingsView,
  notes: NotesView,
  help: HelpView,
  settings: SettingsView,
  profile: ProfileView,
};

export default function Dashboard({ user, onOpenProject }) {
  const [activeView, setActiveView] = useState('recent');
  const { isDarkMode, setIsDarkMode, mounted } = useTheme();

  const ViewComponent = VIEWS[activeView] || RecentView;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={styles.dashboard}
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      <Sidebar
        user={user}
        activeView={activeView}
        onViewChange={setActiveView}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        onLogout={handleLogout}
      />
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <ViewComponent
            user={user}
            onOpenProject={onOpenProject}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}