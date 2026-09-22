'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const ROLE_LABELS = { view: 'viewer', edit: 'editor', admin: 'admin' };

const ACCEPT_FADE_MS = 1200;
const REJECT_FLASH_MS = 900;
const CHUNK_MERGE_WINDOW_MS = 1000;

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function toBase64(bytes) {
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}
function fromBase64(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// One FileEditor = one live file. The parent passes a `room` string that
// is unique per file, plus the user's identity/role, which stay stable
// across files (same person, same role, whichever file they're looking
// at). The parent mounts this with key={fileId}, so switching files
// fully unmounts the old connection and mounts a fresh one - no manual
// teardown/rebuild logic needed here, React's own lifecycle handles it.
export default function FileEditor({ room, role, authorId, userName, userColor }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const bindingRef = useRef(null);
  const decorationsRef = useRef([]);
  const activeChunkRef = useRef(null);
  const fadeIntervalRef = useRef(null); // only runs while something is actively fading

  const [status, setStatus] = useState('connecting');
  const [peers, setPeers] = useState([]);
  const [pendingChunks, setPendingChunks] = useState([]);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', room, ydoc);
    const yText = ydoc.getText('monaco');
    const reviewMap = ydoc.getMap('review');

    // role/authorId/userName/userColor all come from the parent now -
    // they represent the same person across every file they open, not
    // something re-rolled per file.
    const resolvedRole = role;

    provider.awareness.setLocalStateField('user', {
      name: userName,
      color: userColor,
      role: resolvedRole,
    });

    provider.on('status', ({ status }) => setStatus(status));

    const updatePeers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      setPeers(states.map((s) => s.user).filter(Boolean));
    };
    provider.awareness.on('change', updatePeers);
    updatePeers();

    function currentEndIndexOf(chunkId) {
      const chunk = reviewMap.get(chunkId);
      if (!chunk) return null;
      const relEnd = Y.decodeRelativePosition(fromBase64(chunk.relEndB64));
      const absEnd = Y.createAbsolutePositionFromRelativePosition(relEnd, ydoc);
      return absEnd ? absEnd.index : null;
    }

    function findContainingPendingChunk(index) {
      let foundId = null;
      reviewMap.forEach((chunk, id) => {
        if (foundId || chunk.status !== 'pending') return;
        if (chunk.authorId !== authorId) return; // never resume another author's chunk
        const relStart = Y.decodeRelativePosition(fromBase64(chunk.relStartB64));
        const relEnd = Y.decodeRelativePosition(fromBase64(chunk.relEndB64));
        const absStart = Y.createAbsolutePositionFromRelativePosition(relStart, ydoc);
        const absEnd = Y.createAbsolutePositionFromRelativePosition(relEnd, ydoc);
        if (!absStart || !absEnd) return;
        if (index >= absStart.index && index <= absEnd.index) foundId = id;
      });
      return foundId;
    }

    function extendChunk(id, index, length) {
      const chunk = reviewMap.get(id);
      const priorEnd = currentEndIndexOf(id);
      const newEnd = Math.max(priorEnd, index + length);
      const newRelEnd = Y.createRelativePositionFromTypeIndex(yText, newEnd, -1);
      reviewMap.set(id, {
        ...chunk,
        relEndB64: toBase64(Y.encodeRelativePosition(newRelEnd)),
        lastTouchedAt: Date.now(),
      });
      activeChunkRef.current = { id, lastEditTime: Date.now() };
    }

    function handleLocalInsert(index, length) {
      const now = Date.now();
      const active = activeChunkRef.current;

      if (active && reviewMap.has(active.id) && now - active.lastEditTime < CHUNK_MERGE_WINDOW_MS) {
        const chunk = reviewMap.get(active.id);
        const relStart = Y.decodeRelativePosition(fromBase64(chunk.relStartB64));
        const absStart = Y.createAbsolutePositionFromRelativePosition(relStart, ydoc);
        const priorEnd = currentEndIndexOf(active.id);
        if (absStart && priorEnd !== null && index >= absStart.index && index <= priorEnd) {
          extendChunk(active.id, index, length);
          return;
        }
      }

      const containingId = findContainingPendingChunk(index);
      if (containingId) {
        extendChunk(containingId, index, length);
        return;
      }

      const relStart = Y.createRelativePositionFromTypeIndex(yText, index);
      const relEnd = Y.createRelativePositionFromTypeIndex(yText, index + length, -1);
      const id = randomId();
      reviewMap.set(id, {
        id,
        authorId,
        authorName: userName,
        authorColor: userColor,
        status: 'pending',
        relStartB64: toBase64(Y.encodeRelativePosition(relStart)),
        relEndB64: toBase64(Y.encodeRelativePosition(relEnd)),
        lastTouchedAt: now,
      });
      activeChunkRef.current = { id, lastEditTime: now };
    }

    function handleLocalDelete(index, length) {
      const now = Date.now();
      const active = activeChunkRef.current;
      let targetId = null;
      if (active && reviewMap.has(active.id) && now - active.lastEditTime < CHUNK_MERGE_WINDOW_MS) {
        targetId = active.id;
      } else {
        targetId = findContainingPendingChunk(index);
      }
      if (!targetId || !reviewMap.has(targetId)) return;

      const chunk = reviewMap.get(targetId);
      reviewMap.set(targetId, { ...chunk, lastTouchedAt: now });
      activeChunkRef.current = { id: targetId, lastEditTime: now };
    }

    yText.observe((event, transaction) => {
      if (!transaction.local || resolvedRole !== 'edit') return;
      let index = 0;
      for (const op of event.changes.delta) {
        if (op.retain) index += op.retain;
        if (op.insert) {
          handleLocalInsert(index, op.insert.length);
          index += op.insert.length;
        } else if (op.delete) {
          handleLocalDelete(index, op.delete);
        }
      }
    });

    function recomputeDecorations() {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      if (!editor || !monaco) return;
      const model = editor.getModel();
      if (!model) return;

      const now = Date.now();
      const newDecorations = [];
      const nextPending = [];
      const toFinalizeReject = [];
      const toForget = [];
      let hasTransitional = false;

      reviewMap.forEach((chunk, id) => {
        const relStart = Y.decodeRelativePosition(fromBase64(chunk.relStartB64));
        const relEnd = Y.decodeRelativePosition(fromBase64(chunk.relEndB64));
        const absStart = Y.createAbsolutePositionFromRelativePosition(relStart, ydoc);
        const absEnd = Y.createAbsolutePositionFromRelativePosition(relEnd, ydoc);

        if (!absStart || !absEnd) {
          toForget.push(id);
          return;
        }

        if (absEnd.index <= absStart.index) {
          const recentlyTouched =
            chunk.status === 'pending' &&
            chunk.lastTouchedAt &&
            now - chunk.lastTouchedAt < CHUNK_MERGE_WINDOW_MS;
          if (!recentlyTouched) toForget.push(id);
          return;
        }

        if (chunk.status === 'accepted' && chunk.acceptedAt && now - chunk.acceptedAt > ACCEPT_FADE_MS) {
          toForget.push(id);
          return;
        }
        if (chunk.status === 'rejected' && chunk.rejectedAt && now - chunk.rejectedAt > REJECT_FLASH_MS) {
          toFinalizeReject.push({ id, start: absStart.index, end: absEnd.index });
          return;
        }

        const startPos = model.getPositionAt(absStart.index);
        const endPos = model.getPositionAt(absEnd.index);
        const range = new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column);
        const className =
          chunk.status === 'accepted'
            ? 'nexcode-chunk-accepted'
            : chunk.status === 'rejected'
            ? 'nexcode-chunk-rejected'
            : 'nexcode-chunk-pending';
        newDecorations.push({ range, options: { className } });
        if (chunk.status === 'accepted' || chunk.status === 'rejected') {
          hasTransitional = true;
        }

        if (chunk.status === 'pending') {
          nextPending.push({ ...chunk, preview: model.getValueInRange(range) });
        }
      });

      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
      setPendingChunks(nextPending);

      if (toForget.length || toFinalizeReject.length) {
        ydoc.transact(() => {
          toForget.forEach((id) => reviewMap.delete(id));
          toFinalizeReject.forEach(({ id, start, end }) => {
            yText.delete(start, end - start);
            reviewMap.delete(id);
          });
        });
      }

      // Only keep the polling timer alive while something is actually
      // fading out - most of the time nothing is, so this keeps the app
      // idle at (close to) zero CPU instead of ticking forever.
      if (hasTransitional && !fadeIntervalRef.current) {
        fadeIntervalRef.current = setInterval(recomputeDecorations, 300);
      } else if (!hasTransitional && fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    }

    reviewMap.observe(recomputeDecorations);
    yText.observe(recomputeDecorations);

    if (editorRef.current) {
      bindEditor(editorRef.current, ydoc, provider, resolvedRole);
    }

    window.__ydoc = ydoc;
    window.__provider = provider;
    window.__reviewMap = reviewMap;
    window.__role = resolvedRole;
    window.__recomputeDecorations = recomputeDecorations;

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      bindingRef.current?.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  function bindEditor(editor, ydoc, provider, resolvedRole) {
    const yText = ydoc.getText('monaco');
    bindingRef.current = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
    editor.updateOptions({
      readOnly: resolvedRole === 'view',
      readOnlyMessage: { value: "You don't have permission to edit or write code here." },
    });
  }

  function handleEditorMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    if (window.__ydoc && window.__provider) {
      bindEditor(editor, window.__ydoc, window.__provider, window.__role);
      window.__recomputeDecorations?.();
    }
  }

  function acceptChunk(id) {
    const reviewMap = window.__reviewMap;
    const chunk = reviewMap?.get(id);
    if (!chunk) return;
    reviewMap.set(id, { ...chunk, status: 'accepted', acceptedAt: Date.now() });
  }

  function rejectChunk(id) {
    const reviewMap = window.__reviewMap;
    const chunk = reviewMap?.get(id);
    if (!chunk) return;
    reviewMap.set(id, { ...chunk, status: 'rejected', rejectedAt: Date.now() });
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .nexcode-chunk-pending { background-color: rgba(59, 130, 246, 0.18); }
        .nexcode-chunk-accepted { background-color: rgba(34, 197, 94, 0.28); }
        .nexcode-chunk-rejected { background-color: rgba(239, 68, 68, 0.32); }
      `}</style>
      <div
        style={{
          padding: '8px 16px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 14,
        }}
      >
        <strong>Nexcode</strong>
        <span style={{ color: '#888' }}>{room}</span>
        <span style={{ color: status === 'connected' ? '#1D9E75' : '#BA7517' }}>{status}</span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 999,
            fontSize: 12,
            background: role === 'view' ? '#FAEEDA' : role === 'admin' ? '#EDE7FB' : '#EAF3DE',
            color: role === 'view' ? '#854F0B' : role === 'admin' ? '#4B2FA8' : '#3B6D11',
          }}
        >
          {ROLE_LABELS[role]}
        </span>
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          {peers.map((p, i) => (
            <span
              key={i}
              title={`${p.name} (${ROLE_LABELS[p.role] || 'editor'})`}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: p.color,
                color: '#fff',
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {p.name?.[0]}
            </span>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={
              '// Open in two or three tabs: one plain (editor), one ?role=admin.\n' +
              '// Type as the editor - your text turns blue (pending review).\n' +
              '// Accept/reject it from the admin tab\'s panel on the right.\n'
            }
            onMount={handleEditorMount}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>
        {role === 'admin' && (
          <div
            style={{
              width: 260,
              borderLeft: '1px solid #ddd',
              padding: 12,
              overflowY: 'auto',
              fontSize: 13,
            }}
          >
            <strong>Pending review</strong>
            {pendingChunks.length === 0 && (
              <p style={{ color: '#888' }}>Nothing waiting on you right now.</p>
            )}
            {pendingChunks.map((chunk) => (
              <div
                key={chunk.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: chunk.authorColor,
                      display: 'inline-block',
                    }}
                  />
                  <span>{chunk.authorName}</span>
                </div>
                <pre
                  style={{
                    background: '#f6f6f6',
                    padding: 6,
                    borderRadius: 4,
                    overflowX: 'auto',
                    margin: 0,
                    marginBottom: 8,
                  }}
                >
                  {chunk.preview}
                </pre>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => acceptChunk(chunk.id)}
                    style={{
                      flex: 1,
                      background: '#1D9E75',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 0',
                      cursor: 'pointer',
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectChunk(chunk.id)}
                    style={{
                      flex: 1,
                      background: '#D64545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 0',
                      cursor: 'pointer',
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}