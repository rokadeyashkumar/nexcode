'use client';

import { useState } from 'react';
import styles from './sidebar.module.scss';
import { Icons } from '../shared/icons';

const NAV_ITEMS = [
  { id: 'recent', label: 'Recent', icon: Icons.Recent },
  { id: 'projects', label: 'Projects', icon: Icons.Projects },
  { id: 'teams', label: 'Teams', icon: Icons.Teams },
  { id: 'divider-1', label: '', divider: true },
  { id: 'planner', label: 'Planner', icon: Icons.Planner },
  { id: 'meetings', label: 'Meetings', icon: Icons.Meetings },
  { id: 'notes', label: 'Notes', icon: Icons.Notes },
  { id: 'divider-2', label: '', divider: true },
  { id: 'help', label: 'Help', icon: Icons.Help },
  { id: 'settings', label: 'Settings', icon: Icons.Settings },
];

export default function Sidebar({
  user,
  activeView,
  onViewChange,
  isDarkMode,
  onThemeToggle,
  onLogout,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Real user display values
  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'Editor';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoSection}>
        <span className={styles.logo}>NexCode</span>
      </div>

      {/* Search Bar */}
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>
          <Icons.Search />
        </span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          if (item.divider) {
            return <div key={item.id} className={styles.divider} />;
          }
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeView === item.id ? styles.active : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <span className={styles.navIcon}>
                <Icon />
              </span>
              <span className={styles.navLabel}>{item.label}</span>
              {activeView === item.id && <span className={styles.activeIndicator} />}
            </button>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {/* Theme Toggle */}
        <button
          className={styles.themeToggle}
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* User + Logout Row */}
        <div className={styles.userRow}>
          <button
            className={`${styles.userCard} ${activeView === 'profile' ? styles.userCardActive : ''}`}
            onClick={() => onViewChange('profile')}
            aria-label="Open profile"
          >
            <div className={styles.userAvatar}>{avatarLetter}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{displayName}</div>
              <div className={styles.userRole}>{displayRole}</div>
            </div>
          </button>

          <button
            className={styles.logoutBtn}
            onClick={onLogout}
            aria-label="Log out"
            title="Log out"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}