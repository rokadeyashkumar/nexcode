'use client';

import { useState } from 'react';
import styles from './profile.module.scss';

const USER = {
  name: 'Dev Sharma',
  username: '@dev',
  email: 'dev@nexcode.app',
  role: 'Administrator',
  bio: 'Full-stack developer building collaborative tools. Focused on real-time systems and CRDT-based editing.',
  location: 'Nagpur, India',
  joined: 'January 2024',
  website: 'dev.nexcode.app',
};

const STATS = [
  { label: 'Projects', value: '12' },
  { label: 'Teams', value: '4' },
  { label: 'Commits', value: '348' },
  { label: 'Chunks Reviewed', value: '92' },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'review',
    text: 'Approved a pending chunk in',
    target: 'main.js',
    time: '2 min ago',
  },
  {
    id: 2,
    type: 'edit',
    text: 'Edited',
    target: 'utils.js',
    time: '1 hr ago',
  },
  {
    id: 3,
    type: 'invite',
    text: 'Invited Priya as Editor to',
    target: 'Demo Project',
    time: '3 hr ago',
  },
  {
    id: 4,
    type: 'create',
    text: 'Created new file',
    target: 'server.js',
    time: 'Yesterday',
  },
  {
    id: 5,
    type: 'review',
    text: 'Rejected a chunk in',
    target: 'auth.js',
    time: '2 days ago',
  },
];

const PROJECTS = [
  { id: 1, name: 'Demo Project', files: 4, role: 'Admin', live: true },
  { id: 2, name: 'Design System', files: 8, role: 'Editor', live: false },
  { id: 3, name: 'API Gateway', files: 12, role: 'Viewer', live: true },
];

const TEAMS = [
  { id: 1, name: 'Core Platform', members: 3, online: 2 },
  { id: 2, name: 'Design Systems', members: 2, online: 0 },
];

const ACTIVITY_ICON = {
  review: '✓',
  edit: '✎',
  invite: '＋',
  create: '◇',
};

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState('activity');

  return (
    <div className={styles.profile}>
      {/* Cover / Header */}
      <div className={styles.cover}>
        <div className={styles.coverPattern} />
      </div>

      <div className={styles.headerCard}>
        <div className={styles.avatarBlock}>
          <div className={styles.bigAvatar}>D</div>
          <span className={styles.onlineBadge} />
        </div>

        <div className={styles.identity}>
          <h2 className={styles.name}>
            {USER.name}
            <span className={styles.roleTag}>{USER.role}</span>
          </h2>
          <div className={styles.meta}>
            <span>{USER.username}</span>
            <span className={styles.dot}>·</span>
            <span>{USER.email}</span>
          </div>
          <p className={styles.bio}>{USER.bio}</p>
          <div className={styles.metaRow}>
            <span>📍 {USER.location}</span>
            <span>🔗 {USER.website}</span>
            <span>📅 Joined {USER.joined}</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.primaryBtn}>Edit Profile</button>
          <button className={styles.secondaryBtn}>Share</button>
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
          <div className={styles.projectsGrid}>
            {PROJECTS.map((p) => (
              <div key={p.id} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <div className={styles.projectIcon}>{'</>'}</div>
                  <span className={styles.projectRole}>{p.role}</span>
                </div>
                <h4 className={styles.projectName}>{p.name}</h4>
                <div className={styles.projectMeta}>
                  <span>📁 {p.files} files</span>
                  {p.live && (
                    <span className={styles.liveIndicator}>
                      <span className={styles.liveDot} />
                      Live
                    </span>
                  )}
                </div>
                <button className={styles.openBtn}>Open →</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'teams' && (
          <div className={styles.teamsList}>
            {TEAMS.map((t) => (
              <div key={t.id} className={styles.teamRow}>
                <div className={styles.teamIcon}>
                  {t.name.charAt(0)}
                </div>
                <div className={styles.teamInfo}>
                  <div className={styles.teamName}>{t.name}</div>
                  <div className={styles.teamMeta}>{t.members} members</div>
                </div>
                <div className={styles.teamStatus}>
                  {t.online > 0 ? (
                    <>
                      <span className={styles.liveDot} />
                      {t.online} online
                    </>
                  ) : (
                    <span className={styles.offline}>Offline</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}