import styles from './teams.module.scss';
import { Icons } from '../../shared/icons';

const MOCK_TEAMS = [
  {
    id: 't1',
    name: 'Core Platform',
    members: ['Dev', 'Priya', 'Sam'],
    onlineCount: 2,
    project: 'Demo Project',
  },
  {
    id: 't2',
    name: 'Design Systems',
    members: ['Amara', 'Kai'],
    onlineCount: 0,
    project: 'Design System',
  },
];

function Avatar({ name }) {
  return (
    <span className={styles.avatar}>
      {name[0]}
    </span>
  );
}

export default function TeamsView() {
  return (
    <div className={styles.teams}>
      <div className={styles.header}>
        <h2>Teams</h2>
        <button className={styles.createBtn}>+ Create Team</button>
      </div>

      <div className={styles.grid}>
        {MOCK_TEAMS.map((team) => (
          <div key={team.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{team.name}</h3>
              <span className={styles.project}>{team.project}</span>
            </div>
            <div className={styles.members}>
              {team.members.map((m) => (
                <Avatar key={m} name={m} />
              ))}
              <span className={styles.memberCount}>+{team.members.length}</span>
            </div>
            <div className={styles.cardFooter}>
              <span className={team.onlineCount > 0 ? styles.online : styles.offline}>
                {team.onlineCount > 0 ? (
                  <>
                    <span className={styles.liveDot} />
                    {team.onlineCount} online
                  </>
                ) : (
                  'Offline'
                )}
              </span>
              <button className={styles.viewBtn}>View Team</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}