'use client';

import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import FileEditor from '../file-editor/file-editor';

const ROLE_LABELS = { view: 'viewer', edit: 'editor', admin: 'admin' };

// Deterministic color from a string (user email or id)
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

export default function CollabEditor({ user, onBackToDashboard }) {
  const [role, setRole] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [projectStatus, setProjectStatus] = useState('connecting');

  const filesMapRef = useRef(null);

  useEffect(() => {
    // Resolve role from URL (or default to editor)
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get('role');
    const resolvedRole = ROLE_LABELS[requestedRole] ? requestedRole : 'edit';
    setRole(resolvedRole);

    // Use the real logged-in user
    const userName = user?.name || user?.email?.split('@')[0] || 'Anonymous';
    const userEmail = user?.email || '';
    const userColor = colorFromString(userEmail || userName);

    setIdentity({
      authorId: user?.id || randomId(),
      userName,
      userEmail,
      userColor,
    });

    // Yjs project room
    const ydoc = new Y.Doc();
    const SYNC_URL = process.env.NEXT_PUBLIC_SYNC_URL || 'ws://localhost:1234';
const provider = new WebsocketProvider(SYNC_URL, PROJECT_ROOM, ydoc);
    const filesMap = ydoc.getMap('files');
    filesMapRef.current = filesMap;

    provider.on('status', ({ status }) => setProjectStatus(status));

    // Set awareness (presence)
    if (provider.awareness) {
      provider.awareness.setLocalStateField('user', {
        id: user?.id || 'anon',
        name: userName,
        email: userEmail,
        color: userColor,
        role: resolvedRole,
      });
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
      provider.destroy();
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

  const canAddFiles = role === 'edit' || role === 'admin';
  const ready = role && identity && selectedFileId;

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div
        style={{
          width: 200,
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          fontSize: 13,
          background: '#ffffff',
        }}
      >
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #eee', fontWeight: 600 }}>
          <div
            onClick={onBackToDashboard}
            style={{
              fontWeight: 400,
              fontSize: 12,
              color: '#3B82F6',
              cursor: 'pointer',
              marginBottom: 6,
            }}
          >
            ← Dashboard
          </div>
          NexCode
          <div style={{ fontWeight: 400, color: '#888', fontSize: 11, marginTop: 2 }}>
            {projectStatus}
          </div>
        </div>

        {/* Current user badge */}
        {identity && (
          <div
            style={{
              padding: '10px 12px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: identity.userColor,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {identity.userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {identity.userName}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#888',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {identity.userEmail || role}
              </div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFileId(file.id)}
              style={{
                padding: '6px 8px',
                borderRadius: 6,
                cursor: 'pointer',
                marginBottom: 2,
                background: file.id === selectedFileId ? '#EAF3FE' : 'transparent',
                color: file.id === selectedFileId ? '#1D4ED8' : '#333',
              }}
            >
              {file.name}
            </div>
          ))}
        </div>

        {canAddFiles && (
          <div style={{ padding: 8, borderTop: '1px solid #eee' }}>
            <button
              onClick={addFile}
              style={{
                width: '100%',
                padding: '6px 0',
                border: '1px solid #ddd',
                borderRadius: 6,
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              + New file
            </button>
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
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
          <div style={{ padding: 24, color: '#888' }}>Loading project...</div>
        )}
      </div>
    </div>
  );
}