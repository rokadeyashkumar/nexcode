import { useState } from 'react';
import styles from './notes.module.scss';

const MOCK_NOTES = [
  {
    id: 1,
    title: 'API Authentication Flow',
    content: 'JWT authentication with refresh tokens. Login → Access Token (15min) + Refresh Token (7d). Use HttpOnly cookies for security.',
    updated: '2 hours ago',
    tags: ['api', 'auth', 'security'],
    pinned: true,
  },
  {
    id: 2,
    title: 'Meeting Notes - Sprint Planning',
    content: 'Tasks for Sprint 3: 1. Real-time sync with Yjs (Sam), 2. Dashboard UI (Dev), 3. Database optimization (Priya). Demo on Friday.',
    updated: '1 day ago',
    tags: ['meeting', 'sprint', 'planning'],
    pinned: false,
  },
  {
    id: 3,
    title: 'Tech Stack Decisions',
    content: 'Frontend: Next.js 14 + SCSS + Monaco Editor. Backend: Node.js + Yjs. Database: PostgreSQL + Redis for caching.',
    updated: '3 days ago',
    tags: ['tech-stack', 'architecture'],
    pinned: false,
  },
  {
    id: 4,
    title: 'Ideas for Next Sprint',
    content: 'Implement code execution feature. Consider using Docker containers for secure code execution. Add AI-powered code suggestions with Ollama.',
    updated: '5 days ago',
    tags: ['ideas', 'future', 'ai'],
    pinned: false,
  },
];

function NoteCard({ note }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${styles.noteCard} ${note.pinned ? styles.pinned : ''}`}>
      <div className={styles.noteHeader}>
        <div className={styles.noteTitleRow}>
          {note.pinned && <span className={styles.pinIcon}>📌</span>}
          <h3 className={styles.noteTitle}>{note.title}</h3>
        </div>
        <span className={styles.noteDate}>{note.updated}</span>
      </div>

      <p className={`${styles.noteContent} ${isExpanded ? styles.expanded : ''}`}>
        {note.content}
        {note.content.length > 120 && !isExpanded && '...'}
      </p>

      {note.content.length > 120 && (
        <button 
          className={styles.expandBtn}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}

      <div className={styles.noteTags}>
        {note.tags.map((tag) => (
          <span key={tag} className={styles.tag}>#{tag}</span>
        ))}
      </div>

      <div className={styles.noteActions}>
        <button className={styles.actionBtn}>✏️ Edit</button>
        <button className={styles.actionBtn}>📋 Copy</button>
        <button className={styles.actionBtn}>🗑️ Delete</button>
        <button className={styles.actionBtn}>
          {note.pinned ? '📌 Unpin' : '📌 Pin'}
        </button>
      </div>
    </div>
  );
}

export default function NotesView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = MOCK_NOTES.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.pinned);

  return (
    <div className={styles.notes}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Notes</h2>
          <span className={styles.noteCount}>{filteredNotes.length} notes</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search notes..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={styles.createBtn}>+ New Note</button>
        </div>
      </div>

      {pinnedNotes.length > 0 && (
        <>
          <div className={styles.sectionLabel}>📌 Pinned</div>
          <div className={styles.notesGrid}>
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </>
      )}

      {unpinnedNotes.length > 0 && (
        <>
          <div className={styles.sectionLabel}>📝 All Notes</div>
          <div className={styles.notesGrid}>
            {unpinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </>
      )}

      {filteredNotes.length === 0 && (
        <div className={styles.emptyState}>
          <span>📭</span>
          <p>No notes found</p>
          <span className={styles.emptySubtext}>Create your first note to get started</span>
        </div>
      )}
    </div>
  );
}