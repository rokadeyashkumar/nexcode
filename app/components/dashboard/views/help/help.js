'use client';

import { useState } from 'react';
import styles from './help.module.scss';

const FAQ_ITEMS = [
  {
    id: 1,
    question: 'How do I invite a teammate to my project?',
    answer: 'Open the project from the Projects tab, click the team avatars in the top-right of the editor, then enter the teammate\'s email and choose their role — Viewer, Editor, or Administrator.',
  },
  {
    id: 2,
    question: 'What is the difference between Viewer, Editor, and Administrator?',
    answer: 'A Viewer can read the file and see live cursors but cannot type. An Editor can write — every change goes into review as a pending chunk. An Administrator can also accept or reject pending chunks.',
  },
  {
    id: 3,
    question: 'How does region-level review work?',
    answer: 'When an editor types, the change is captured as a "chunk" with a pending status. Admins see a shaded region they can accept (turns back to normal) or reject (removed for everyone).',
  },
  {
    id: 4,
    question: 'Can I run code inside NexCode?',
    answer: 'Yes. The in-editor terminal at the bottom of the editor runs shell commands and streams the output back. Use the Show/Hide Terminal button in the editor toolbar to toggle it.',
  },
  {
    id: 5,
    question: 'Do I need a GitHub account to use NexCode?',
    answer: 'No. During the beta you can log in with any email. GitHub integration for automatic commits is coming soon.',
  },
  {
    id: 6,
    question: 'Is my code saved if I close the browser?',
    answer: 'Yjs update logs provide durability across sessions. Persistent storage on PostgreSQL is currently in progress.',
  },
];

const SHORTCUTS = [
  { keys: ['↑', '↓'], action: 'Navigate command history in the terminal' },
  { keys: ['Enter'], action: 'Run the current terminal command' },
  { keys: ['Ctrl', 'K'], action: 'Open the search bar' },
  { keys: ['Ctrl', 'B'], action: 'Toggle the file sidebar' },
  { keys: ['Ctrl', '`'], action: 'Toggle the terminal' },
  { keys: ['Esc'], action: 'Close the current dialog or menu' },
];

export default function HelpView() {
  const [openFaq, setOpenFaq] = useState(null);
  const [query, setQuery] = useState('');

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.help}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Help & Support</h2>
          <span className={styles.count}>{FAQ_ITEMS.length} articles</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              type="text"
              placeholder="Search help..."
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <div className={styles.quickCard}>
          <h4>Documentation</h4>
          <p>Read the full user guide</p>
          <button className={styles.quickBtn}>Open Docs →</button>
        </div>
        <div className={styles.quickCard}>
          <h4>Keyboard Shortcuts</h4>
          <p>Speed up your workflow</p>
          <button className={styles.quickBtn}>View Shortcuts →</button>
        </div>
        <div className={styles.quickCard}>
          <h4>Contact Support</h4>
          <p>Get help from our team</p>
          <button className={styles.quickBtn}>Email Support →</button>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className={styles.sectionLabel}>Frequently Asked Questions</div>
      <div className={styles.faqList}>
        {filteredFaqs.map((item) => (
          <div
            key={item.id}
            className={`${styles.faqItem} ${openFaq === item.id ? styles.open : ''}`}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
            >
              <span>{item.question}</span>
              <span className={styles.chevron}>
                {openFaq === item.id ? '−' : '+'}
              </span>
            </button>
            {openFaq === item.id && (
              <div className={styles.faqAnswer}>{item.answer}</div>
            )}
          </div>
        ))}
        {filteredFaqs.length === 0 && (
          <div className={styles.emptyState}>
            No articles matched your search.
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Table */}
      <div className={styles.sectionLabel}>Keyboard Shortcuts</div>
      <div className={styles.shortcutTable}>
        {SHORTCUTS.map((s, i) => (
          <div key={i} className={styles.shortcutRow}>
            <div className={styles.keys}>
              {s.keys.map((k, j) => (
                <kbd key={j} className={styles.kbd}>
                  {k}
                </kbd>
              ))}
            </div>
            <span className={styles.action}>{s.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}