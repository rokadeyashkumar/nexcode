'use client';

import { useState } from 'react';
import styles from './profile.module.scss';

const STATS = [
  { label: 'Projects', value: '0' },
  { label: 'Teams', value: '0' },
  { label: 'Commits', value: '0' },
  { label: 'Chunks Reviewed', value: '0' },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'create',
    text: 'Account created',
    target: 'NexCode',
    time: 'just now',
  },
];

const PROJECTS = [];
const TEAMS = [];

const ACTIVITY_ICON = {
  review: '✓',
  edit: '✎',
  invite: '＋',
  create: '◇',
};

export default function ProfileView({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('activity');

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'Editor';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const username = '@' + (displayEmail.split('@')[0] || 'user');

  return (
    <div className={styles.profile}>
      {/* Cover */}
      <div className={styles.cover}>
        <div className={styles.coverPattern} />
      </div>

      <div className={styles.headerCard}>
        <div className={styles.avatarBlock}>
          <div className={styles.bigAvatar}>{avatarLetter}</div>
          <span className={styles.onlineBadge} />
        </div>

        <div className={styles.identity}>
          <h2 className={styles.name}>
            {displayName}
            <span className={styles.roleTag}>{displayRole}</span>
          </h2>
          <div className={styles.meta}>
            <span>{username}</span>
            <span className={styles.dot}>·</span>
            <span>{displayEmail}</span>
          </div>
          <p className={styles.bio}>
            Welcome to NexCode. Start collaborating by creating a project
            and inviting your team.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.primaryBtn}>Edit Profile</button>
          <button className={styles.secondaryBtn} onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'activity' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'projects' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'teams' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Teams
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'activity' && (
          <div className={styles.activityList}>
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className={styles.activityItem}>
                <div className={`${styles.activityIcon} ${styles[item.type]}`}>
                  {ACTIVITY_ICON[item.type]}
                </div>
                <div className={styles.activityBody}>
                  <span className={styles.activityText}>
                    {item.text}{' '}
                    <strong className={styles.activityTarget}>{item.target}</strong>
                  </span>
                  <span className={styles.activityTime}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className={styles.emptyState}>
            <p>No projects yet</p>
            <span>Create your first project to get started</span>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className={styles.emptyState}>
            <p>No teams yet</p>
            <span>Join or create a team to collaborate</span>
          </div>
        )}
      </div>
    </div>
  );
}