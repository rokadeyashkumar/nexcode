'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { ApinatorProvider } from '@/lib/apinator-provider';
import FileEditor from '../file-editor/file-editor';
import TerminalComponent from '../terminal/terminal';
import Menubar from './menubar/menubar';
import FileTree from './file-tree/file-tree';
import Tabs from './tabs/tabs';
import StatusBar from './statusbar/statusbar';
import RunToggle from './run-toggle/run-toggle';
import styles from './collab-editor.module.scss';

const ROLE_LABELS = { view: 'viewer', edit: 'editor', admin: 'admin' };

const CURSOR_COLORS = [
  '#D85A30', '#1D9E75', '#378ADD', '#D4537E',
  '#BA7517', '#7F77DD', '#22C55E', '#EF4444',
];

function colorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const PROJECT_ROOM = 'nexcode-project-demo';
const MIN_TERMINAL_HEIGHT = 120;
const MAX_TERMINAL_HEIGHT = 800;
const DEFAULT_TERMINAL_RATIO = 0.3;

export default function CollabEditor({ user, onBackToDashboard }) {
  const [role, setRole] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [projectStatus, setProjectStatus] = useState('connecting');

  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState(null);

  const [runMode, setRunMode] = useState('own');
  const [onlineUsers, setOnlineUsers] = useState([]);

  const filesMapRef = useRef(null);
  const providerRef = useRef(null);
  const resizingRef = useRef(false);

  // ---------- Terminal resize handler ----------
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    resizingRef.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const initialHeight = Math.round(window.innerHeight * DEFAULT_TERMINAL_RATIO);
    setTerminalHeight(initialHeight);

    const handleMouseMove = (e) => {
      if (!resizingRef.current) return;
      const newHeight = window.innerHeight - e.clientY;
      const clamped = Math.max(
        MIN_TERMINAL_HEIGHT,
        Math.min(MAX_TERMINAL_HEIGHT, newHeight)
      );
      setTerminalHeight(clamped);
    };

    const handleMouseUp = () => {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // ---------- Initialize Yjs + Apinator ----------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get('role');
    const resolvedRole = ROLE_LABELS[requestedRole] ? requestedRole : 'edit';
    setRole(resolvedRole);

    const userName = user?.name || user?.email?.split('@')[0] || 'Anonymous';
    const userEmail = user?.email || '';
    const userColor = colorFromString(userEmail || userName);

    setIdentity({
      authorId: user?.id || randomId(),
      userName,
      userEmail,
      userColor,
    });

    const ydoc = new Y.Doc();
    const filesMap = ydoc.getMap('files');
    filesMapRef.current = filesMap;

    // --- APINATOR PROVIDER ---
    let provider;
    try {
      provider = new ApinatorProvider(
        PROJECT_ROOM,
        ydoc,
        {
          id: user?.id || 'anon',
          name: userName,
          email: userEmail,
          color: userColor,
        },
        {
          onConnected: () => setProjectStatus('connected'),
          onPresenceChange: (event) => {
            if (event.type === 'join') {
              setOnlineUsers((prev) => {
                const exists = prev.find((u) => u.id === event.user.id);
                return exists ? prev : [...prev, event.user];
              });
            } else if (event.type === 'leave') {
              setOnlineUsers((prev) => prev.filter((u) => u.id !== event.user.id));
            }
          },
        }
      );

      providerRef.current = provider;

      // Show current user in presence immediately
      setOnlineUsers([
        {
          id: user?.id || 'anon',
          name: userName,
          email: userEmail,
          color: userColor,
        },
      ]);
    } catch (error) {
      console.error('ApinatorProvider init failed:', error);
      setProjectStatus('disconnected');
    }

    function syncFilesState() {
      const list = Array.from(filesMap.values()).sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setFiles(list);
      setSelectedFileId((current) => current ?? list[0]?.id ?? null);
    }

    filesMap.observe(syncFilesState);
    syncFilesState();

    if (filesMap.size === 0) {
      const id = 'main';
      filesMap.set(id, { id, name: 'main.js', createdAt: Date.now() });
    }

    return () => {
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      ydoc.destroy();
    };
  }, [user]);

  function addFile() {
    const filesMap = filesMapRef.current;
    if (!filesMap) return;
    const name = window.prompt('New file name (e.g. utils.js):');
    if (!name || !name.trim()) return;
    const id = randomId();
    filesMap.set(id, { id, name: name.trim(), createdAt: Date.now() });
    setSelectedFileId(id);
  }

  function deleteFile(fileId) {
    const filesMap = filesMapRef.current;
    if (!filesMap) return;
    if (!confirm('Delete this file?')) return;
    filesMap.delete(fileId);
    if (selectedFileId === fileId) {
      const remaining = files.filter((f) => f.id !== fileId);
      setSelectedFileId(remaining[0]?.id || null);
    }
  }

  const canAddFiles = role === 'edit' || role === 'admin';
  const ready = role && identity && selectedFileId;
  const currentFile = files.find((f) => f.id === selectedFileId);
  const terminalReady = terminalHeight !== null;

  return (
    <div className={styles.editor}>
      <Menubar
        onBackToDashboard={onBackToDashboard}
        showTerminal={showTerminal}
        onToggleTerminal={() => setShowTerminal((v) => !v)}
        canAddFiles={canAddFiles}
        onAddFile={addFile}
        runMode={runMode}
        onRunModeChange={setRunMode}
      />

      <div className={styles.body}>
        <FileTree
          files={files}
          selectedFileId={selectedFileId}
          onSelect={setSelectedFileId}
          onAddFile={addFile}
          onDeleteFile={deleteFile}
          canAddFiles={canAddFiles}
        />

        <div className={styles.workArea}>
          <Tabs
            files={files}
            selectedFileId={selectedFileId}
            onSelect={setSelectedFileId}
            onClose={deleteFile}
          />

          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <span className={styles.fileName}>
                {currentFile?.name || 'No file selected'}
              </span>
            </div>
            <div className={styles.toolbarRight}>
              <RunToggle value={runMode} onChange={setRunMode} />
            </div>
          </div>

          <div className={styles.editorSplit}>
            <div className={styles.editorPanel}>
              {ready ? (
                <FileEditor
                  key={selectedFileId}
                  room={`file-${selectedFileId}`}
                  role={role}
                  authorId={identity.authorId}
                  userName={identity.userName}
                  userColor={identity.userColor}
                  runMode={runMode}
                />
              ) : (
                <div className={styles.loading}>Loading project...</div>
              )}
            </div>

            {showTerminal && terminalReady && (
              <>
                <div
                  className={styles.resizeHandle}
                  onMouseDown={handleMouseDown}
                  role="separator"
                  aria-orientation="horizontal"
                  title="Drag to resize"
                >
                  <div className={styles.resizeGrip} />
                </div>

                <div
                  className={styles.terminalPanel}
                  style={{ height: `${terminalHeight}px` }}
                >
                  <TerminalComponent
                    onClose={() => setShowTerminal(false)}
                    runMode={runMode}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <StatusBar
        status={projectStatus}
        onlineUsers={onlineUsers}
        currentUser={identity}
        currentFile={currentFile}
        runMode={runMode}
      />
    </div>
  );
}