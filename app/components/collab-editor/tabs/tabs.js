'use client';

import styles from './tabs.module.scss';

export default function Tabs({ files, selectedFileId, onSelect, onClose }) {
  if (files.length === 0) return null;

  return (
    <div className={styles.tabs}>
      {files.map((file) => (
        <div
          key={file.id}
          className={`${styles.tab} ${selectedFileId === file.id ? styles.tabActive : ''}`}
          onClick={() => onSelect(file.id)}
        >
          <span className={styles.tabName}>{file.name}</span>
          <button
            className={styles.closeBtn}
            onClick={(e) => {
              e.stopPropagation();
              onClose(file.id);
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}