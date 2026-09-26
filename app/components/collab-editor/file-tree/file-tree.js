'use client';

import { useState } from 'react';
import styles from './file-tree.module.scss';

// Detect file icon based on extension
function getFileIcon(name) {
  const ext = name.split('.').pop()?.toLowerCase();
  const icons = {
    js: 'JS',
    jsx: 'JS',
    ts: 'TS',
    tsx: 'TS',
    py: 'PY',
    css: 'CSS',
    scss: 'SCSS',
    html: 'HTML',
    json: '{ }',
    md: 'MD',
    txt: 'TXT',
    svg: 'SVG',
  };
  return icons[ext] || 'FILE';
}

export default function FileTree({
  files,
  selectedFileId,
  onSelect,
  onAddFile,
  onDeleteFile,
  canAddFiles,
}) {
  const [contextMenu, setContextMenu] = useState(null);

  function handleContextMenu(e, file) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  }

  function closeContextMenu() {
    setContextMenu(null);
  }

  return (
    <div className={styles.fileTree} onClick={closeContextMenu}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>Explorer</span>
        {canAddFiles && (
          <button
            className={styles.headerBtn}
            onClick={onAddFile}
            title="New File"
          >
            +
          </button>
        )}
      </div>

      <div className={styles.projectName}>
        <span className={styles.projectIcon}>📁</span>
        <span>NEXCODE-PROJECT</span>
      </div>

      <div className={styles.treeContent}>
        {files.map((file) => (
          <div
            key={file.id}
            className={`${styles.fileItem} ${
              selectedFileId === file.id ? styles.fileItemActive : ''
            }`}
            onClick={() => onSelect(file.id)}
            onContextMenu={(e) => handleContextMenu(e, file)}
          >
            <span className={styles.fileIcon}>{getFileIcon(file.name)}</span>
            <span className={styles.fileName}>{file.name}</span>
          </div>
        ))}

        {files.length === 0 && (
          <div className={styles.emptyState}>No files yet</div>
        )}
      </div>

      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.contextItem}
            onClick={() => {
              onDeleteFile(contextMenu.file.id);
              closeContextMenu();
            }}
          >
            Delete File
          </button>
        </div>
      )}
    </div>
  );
}