import styles from './projects.module.scss';
import { Icons } from '../../shared/icons';

export default function ProjectsView({ onOpenProject }) {
  return (
    <div className={styles.projects}>
      <div className={styles.header}>
        <h2>Projects</h2>
        <button className={styles.createBtn}>+ New Project</button>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.icon}>
              <Icons.Folder />
            </div>
            <span className={styles.badge}>Active</span>
          </div>
          <div className={styles.cardBody}>
            <h3>Demo Project</h3>
            <p>main.js and other files, live now</p>
            <div className={styles.meta}>
              <span>👥 3 collaborators</span>
              <span>📁 4 files</span>
            </div>
          </div>
          <div className={styles.cardFooter}>
            <button className={styles.openBtn} onClick={onOpenProject}>
              Open Project →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}