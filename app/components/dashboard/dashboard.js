'use client';

import { useState } from 'react';
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
import ProfileView from './views/profile/profile'; // 👈 NEW

const VIEWS = {
  recent: RecentView,
  projects: ProjectsView,
  teams: TeamsView,
  planner: PlannerView,
  meetings: MeetingsView,
  notes: NotesView,
  help: HelpView,
  settings: SettingsView,
  profile: ProfileView, // 👈 NEW
};

export default function Dashboard({ onOpenProject }) {
  const [activeView, setActiveView] = useState('recent');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const ViewComponent = VIEWS[activeView] || RecentView;

  return (
    <div
      className={styles.dashboard}
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <ViewComponent onOpenProject={onOpenProject} />
        </div>
      </div>
    </div>
  );
}