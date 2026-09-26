'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './menubar.module.scss';

const MENUS = {
  file: {
    label: 'File',
    items: [
      { label: 'New File', shortcut: 'Ctrl+N', action: 'newFile' },
      { label: 'Save', shortcut: 'Ctrl+S', action: 'save' },
      { divider: true },
      { label: 'Back to Dashboard', action: 'backToDashboard' },
    ],
  },
  edit: {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', shortcut: 'Ctrl+Y' },
      { divider: true },
      { label: 'Find', shortcut: 'Ctrl+F' },
      { label: 'Replace', shortcut: 'Ctrl+H' },
    ],
  },
  select: {
    label: 'Select',
    items: [
      { label: 'Select All', shortcut: 'Ctrl+A' },
      { label: 'Expand Selection' },
      { label: 'Shrink Selection' },
    ],
  },
  view: {
    label: 'View',
    items: [
      { label: 'Toggle File Tree', action: 'toggleFileTree' },
      { label: 'Toggle Terminal', shortcut: 'Ctrl+`', action: 'toggleTerminal' },
      { divider: true },
      { label: 'Zoom In', shortcut: 'Ctrl+=' },
      { label: 'Zoom Out', shortcut: 'Ctrl+-' },
    ],
  },
  go: {
    label: 'Go',
    items: [
      { label: 'Go to File...', shortcut: 'Ctrl+P' },
      { label: 'Go to Line...', shortcut: 'Ctrl+G' },
    ],
  },
  run: {
    label: 'Run',
    items: [
      { label: 'Run Own Code', action: 'runOwn' },
      { label: 'Run Team Code', action: 'runTeam' },
      { divider: true },
      { label: 'Run in Terminal', shortcut: 'Ctrl+Enter', action: 'runTerminal' },
    ],
  },
  terminal: {
    label: 'Terminal',
    items: [
      { label: 'New Terminal', action: 'toggleTerminal' },
      { label: 'Clear Terminal' },
    ],
  },
  help: {
    label: 'Help',
    items: [
      { label: 'Documentation' },
      { label: 'Keyboard Shortcuts' },
      { divider: true },
      { label: 'About NexCode' },
    ],
  },
};

export default function Menubar({
  onBackToDashboard,
  showTerminal,
  onToggleTerminal,
  canAddFiles,
  onAddFile,
  runMode,
  onRunModeChange,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const menubarRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return;
    const handler = (e) => {
      if (!menubarRef.current?.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  function handleMenuClick(id) {
    setOpenMenu((current) => (current === id ? null : id));
  }

  function handleItemClick(action) {
    setOpenMenu(null);
    switch (action) {
      case 'backToDashboard':
        onBackToDashboard();
        break;
      case 'newFile':
        if (canAddFiles) onAddFile();
        break;
      case 'toggleTerminal':
        onToggleTerminal();
        break;
      case 'runOwn':
        onRunModeChange('own');
        onToggleTerminal(true);
        break;
      case 'runTeam':
        onRunModeChange('team');
        onToggleTerminal(true);
        break;
      case 'runTerminal':
        onToggleTerminal(true);
        break;
      default:
        break;
    }
  }

  return (
    <div className={styles.menubar} ref={menubarRef}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>{'</>'}</span>
        <span className={styles.brandText}>NexCode</span>
      </div>

      <div className={styles.menus}>
        {Object.entries(MENUS).map(([id, menu]) => (
          <div key={id} className={styles.menuWrapper}>
            <button
              className={`${styles.menuBtn} ${openMenu === id ? styles.menuBtnActive : ''}`}
              onClick={() => handleMenuClick(id)}
            >
              {menu.label}
            </button>

            {openMenu === id && (
              <div className={styles.dropdown}>
                {menu.items.map((item, i) => {
                  if (item.divider) {
                    return <div key={i} className={styles.divider} />;
                  }
                  return (
                    <button
                      key={i}
                      className={styles.dropdownItem}
                      onClick={() => handleItemClick(item.action)}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className={styles.shortcut}>{item.shortcut}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.right}>
        <span className={styles.modeBadge}>
          {runMode === 'own' ? 'Own Mode' : 'Team Mode'}
        </span>
      </div>
    </div>
  );
}