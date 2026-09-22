'use client';

import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import FileEditor from '../file-editor/file-editor';
import TerminalComponent from '../terminal/terminal';
import styles from './collab-editor.module.scss';

const NAMES = ['Amara', 'Dev', 'Priya', 'Sam', 'Noor', 'Kai'];
const COLORS = ['#D85A30', '#1D9E75', '#378ADD', '#D4537E', '#BA7517', '#7F77DD'];
const ROLE_LABELS = { view: 'viewer', edit: 'editor', admin: 'admin' };

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const PROJECT_ROOM = 'nexcode-project-demo';

export default function CollabEditor({ onBackToDashboard }) {
  const [role, setRole] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [projectStatus, setProjectStatus] = useState('connecting');
  const [showTerminal, setShowTerminal] = useState(true);

  const filesMapRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get('role');
    const resolvedRole = ROLE_LABELS[requestedRole] ? requestedRole : 'edit';
    setRole(resolvedRole);
    setIdentity({
      authorId: randomId(),
      userName: randomFrom(NAMES),
      userColor: randomFrom(COLORS),
    });

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', PROJECT_ROOM, ydoc);
    const filesMap = ydoc.getMap('files');
    filesMapRef.current = filesMap;

    provider.on('status', ({ status }) => setProjectStatus(status));

    function syncFilesState() {
      const list = Array.from(filesMap.values()).sort((a, b) => a.createdAt - b.createdAt);
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
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  function addFile() {
    const filesMap = filesMapRef.current;
    if (!filesMap) return;
    const name = window.prompt('New file name (e.g. utils.js):');
    if (!name || !name.trim()) return;
    const id = randomId();
    filesMap.set(id, { id, name: name.trim(), createdAt: Date.now() });
    setSelectedFileId(id);
  }

  const canAddFiles = role === 'edit' || role === 'admin';
  const ready = role && identity && selectedFileId;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div onClick={onBackToDashboard} className={styles.backBtn}>
            ← Dashboard
          </div>
          <div className={styles.projectTitle}>NexCode</div>
          <div className={styles.projectStatus}>{projectStatus}</div>
        </div>

        <div className={styles.fileList}>
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFileId(file.id)}
              className={`${styles.fileItem} ${file.id === selectedFileId ? styles.active : ''}`}
            >
              <span className={styles.fileIcon}>📄</span>
              {file.name}
            </div>
          ))}
        </div>

        {canAddFiles && (
          <div className={styles.fileActions}>
            <button onClick={addFile} className={styles.addFileBtn}>
              + New File
            </button>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className={styles.editorArea}>
        <div className={styles.editorToolbar}>
          <div className={styles.toolbarLeft}>
            <span className={styles.fileInfo}>
              {selectedFileId ? files.find(f => f.id === selectedFileId)?.name || 'No file selected' : 'No file selected'}
            </span>
          </div>
          <div className={styles.toolbarRight}>
            <button 
              className={`${styles.terminalToggle} ${showTerminal ? styles.active : ''}`}
              onClick={() => setShowTerminal(!showTerminal)}
            >
              {showTerminal ? '▼ Hide Terminal' : '▶ Show Terminal'}
            </button>
          </div>
        </div>

        <div className={styles.editorWrapper}>
          {ready ? (
            <FileEditor
              key={selectedFileId}
              room={`file-${selectedFileId}`}
              role={role}
              authorId={identity.authorId}
              userName={identity.userName}
              userColor={identity.userColor}
            />
          ) : (
            <div className={styles.loading}>Loading project...</div>
          )}
        </div>

        {/* Terminal */}
        {showTerminal && (
          <TerminalComponent 
            onClose={() => setShowTerminal(false)}
            initialCommand="help"
          />
        )}
      </div>
    </div>
  );
}