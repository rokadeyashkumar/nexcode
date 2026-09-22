import styles from './recent.module.scss';
import { Icons } from '../../shared/icons';

const MOCK_RECENT = [
  { id: 'r1', file: 'main.js', project: 'Demo project', editedAgo: '2 min ago', live: true },
  { id: 'r2', file: 'utils.js', project: 'Demo project', editedAgo: '1 hr ago', live: false },
  { id: 'r3', file: 'server.js', project: 'Demo project', editedAgo: 'yesterday', live: false },
  { id: 'r4', file: 'styles.css', project: 'Demo project', editedAgo: '2 days ago', live: false },
];

export default function RecentView() {
  return (
    <div className={styles.recent}>
      <div className={styles.header}>
        <h2>Recent</h2>
        <span className={styles.count}>{MOCK_RECENT.length} files</span>
      </div>

      <div className={styles.list}>
        {MOCK_RECENT.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.left}>
              <span className={item.live ? styles.liveDot : styles.dotSpacer} />
              <span className={styles.fileIcon}>
                <Icons.File />
              </span>
              <span className={styles.fileName}>{item.file}</span>
            </div>
            <div className={styles.right}>
              <span className={styles.project}>{item.project}</span>
              <span className={styles.time}>{item.editedAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}