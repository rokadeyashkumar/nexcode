'use client';

import styles from './statusbar.module.scss';

export default function StatusBar({
  status,
  onlineUsers,
  currentUser,
  currentFile,
  runMode,
}) {
  const statusLabel = {
    connected: 'Connected',
    connecting: 'Connecting...',
    disconnected: 'Disconnected',
  }[status] || status;

  return (
    <div className={styles.statusbar}>
      <div className={styles.left}>
        <span className={`${styles.statusDot} ${styles[status] || ''}`} />
        <span className={styles.statusText}>{statusLabel}</span>

        <span className={styles.divider} />
        <span className={styles.item}>
          <span className={styles.icon}>👥</span>
          {onlineUsers.length} online
        </span>

        <span className={styles.divider} />
        <span className={styles.item}>
          {currentFile?.name || 'No file'}
        </span>
      </div>

      <div className={styles.right}>
        <span className={styles.item}>
          <span className={styles.icon}>
            {runMode === 'own' ? '👤' : '👥'}
          </span>
          {runMode === 'own' ? 'Own Mode' : 'Team Mode'}
        </span>

        <span className={styles.divider} />

        <span className={styles.item}>
          <span className={styles.icon}>⚡</span>
          {currentUser?.userName || 'Anonymous'}
        </span>
      </div>
    </div>
  );
}