'use client';

import { useState } from 'react';
import styles from './settings.module.scss';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'access', label: 'Access & Roles' },
  { id: 'danger', label: 'Danger Zone' },
];

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [name, setName] = useState('Dev');
  const [email, setEmail] = useState('dev@nexcode.app');
  const [role, setRole] = useState('Administrator');

  // Appearance state
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [notifyMentions, setNotifyMentions] = useState(true);
  const [notifyReviews, setNotifyReviews] = useState(true);
  const [notifyInvites, setNotifyInvites] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);

  // Access
  const [defaultRole, setDefaultRole] = useState('editor');
  const [requireApproval, setRequireApproval] = useState(true);

  const handleSave = () => {
    alert('Settings saved (demo)');
  };

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <h2>Settings</h2>
        <span className={styles.subtitle}>Manage your account and preferences</span>
      </div>

      <div className={styles.layout}>
        {/* Sidebar tabs */}
        <aside className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className={styles.panel}>
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <section className={styles.section}>
              <h3>Profile Information</h3>
              <p className={styles.sectionDesc}>
                Update your personal details and how others see you.
              </p>

              <div className={styles.avatarRow}>
                <div className={styles.bigAvatar}>D</div>
                <div className={styles.avatarActions}>
                  <button className={styles.primaryBtn}>Upload new photo</button>
                  <button className={styles.secondaryBtn}>Remove</button>
                </div>
              </div>

              <div className={styles.field}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Role</label>
                <input type="text" value={role} disabled />
                <span className={styles.hint}>
                  Roles are assigned by a project administrator.
                </span>
              </div>

              <div className={styles.actions}>
                <button className={styles.primaryBtn} onClick={handleSave}>
                  Save Changes
                </button>
                <button className={styles.secondaryBtn}>Cancel</button>
              </div>
            </section>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <section className={styles.section}>
              <h3>Appearance</h3>
              <p className={styles.sectionDesc}>
                Customize how NexCode looks on your screen.
              </p>

              <div className={styles.field}>
                <label>Theme</label>
                <div className={styles.radioGroup}>
                  {['light', 'dark', 'system'].map((t) => (
                    <label key={t} className={styles.radio}>
                      <input
                        type="radio"
                        name="theme"
                        value={t}
                        checked={theme === t}
                        onChange={() => setTheme(t)}
                      />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label>Editor Font Size</label>
                <div className={styles.radioGroup}>
                  {['small', 'medium', 'large'].map((s) => (
                    <label key={s} className={styles.radio}>
                      <input
                        type="radio"
                        name="fontSize"
                        value={s}
                        checked={fontSize === s}
                        onChange={() => setFontSize(s)}
                      />
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleLabel}>Compact Mode</div>
                  <div className={styles.toggleDesc}>
                    Show more items in less space
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            </section>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <section className={styles.section}>
              <h3>Notifications</h3>
              <p className={styles.sectionDesc}>
                Choose what you want to be notified about.
              </p>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleLabel}>Mentions</div>
                  <div className={styles.toggleDesc}>
                    When someone mentions you in a comment
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifyMentions}
                    onChange={(e) => setNotifyMentions(e.target.checked)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleLabel}>Review Updates</div>
                  <div className={styles.toggleDesc}>
                    When your chunk is accepted or rejected
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifyReviews}
                    onChange={(e) => setNotifyReviews(e.target.checked)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleLabel}>Team Invitations</div>
                  <div className={styles.toggleDesc}>
                    When someone invites you to a project
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifyInvites}
                    onChange={(e) => setNotifyInvites(e.target.checked)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleLabel}>Weekly Digest</div>
                  <div className={styles.toggleDesc}>
                    Summary of project activity every Monday
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifyWeekly}
                    onChange={(e) => setNotifyWeekly(e.target.checked)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            </section>
          )}

          {/* ACCESS & ROLES */}
          {activeTab === 'access' && (
            <section className={styles.section}>
              <h3>Access & Roles</h3>
              <p className={styles.sectionDesc}>
                Control default permissions for new collaborators.
              </p>

              <div className={styles.field}>
                <label>Default Role for New Members</label>
                <select
                  value={defaultRole}
                  onChange={(e) => setDefaultRole(e.target.value)}
                >
                  <option value="viewer">Viewer — read-only access</option>
                  <option value="editor">Editor — can write, changes go to review</option>
                  <option value="admin">Administrator — can approve or reject</option>
                </select>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleLabel}>Require Review Approval</div>
                  <div className={styles.toggleDesc}>
                    All edits from non-admins stay pending until approved
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={requireApproval}
                    onChange={(e) => setRequireApproval(e.target.checked)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.infoBox}>
                <strong>Note:</strong> Role changes take effect on the next sync.
                Everyone in the room will see the updated role immediately.
              </div>

              <div className={styles.actions}>
                <button className={styles.primaryBtn} onClick={handleSave}>
                  Save Access Settings
                </button>
              </div>
            </section>
          )}

          {/* DANGER ZONE */}
          {activeTab === 'danger' && (
            <section className={styles.section}>
              <h3 className={styles.dangerTitle}>Danger Zone</h3>
              <p className={styles.sectionDesc}>
                Irreversible actions. Please be careful.
              </p>

              <div className={styles.dangerRow}>
                <div>
                  <div className={styles.dangerLabel}>Export Account Data</div>
                  <div className={styles.dangerDesc}>
                    Download a copy of your profile, projects, and notes
                  </div>
                </div>
                <button className={styles.secondaryBtn}>Export</button>
              </div>

              <div className={styles.dangerRow}>
                <div>
                  <div className={styles.dangerLabel}>Sign Out of All Devices</div>
                  <div className={styles.dangerDesc}>
                    End every active session on all browsers
                  </div>
                </div>
                <button className={styles.secondaryBtn}>Sign Out All</button>
              </div>

              <div className={styles.dangerRow}>
                <div>
                  <div className={styles.dangerLabel}>Delete Account</div>
                  <div className={styles.dangerDesc}>
                    Permanently remove your account and all associated data
                  </div>
                </div>
                <button className={styles.dangerBtn}>Delete Account</button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}