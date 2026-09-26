'use client';

import styles from './run-toggle.module.scss';

export default function RunToggle({ value, onChange }) {
  return (
    <div className={styles.toggle} role="group" aria-label="Run mode">
      <button
        type="button"
        className={`${styles.option} ${value === 'own' ? styles.optionActive : ''}`}
        onClick={() => onChange('own')}
        title="Run only your own code — others' pending changes are ignored"
      >
        <span className={styles.dot} />
        Own
      </button>
      <button
        type="button"
        className={`${styles.option} ${value === 'team' ? styles.optionActive : ''}`}
        onClick={() => onChange('team')}
        title="Run the merged accepted code from the whole team"
      >
        <span className={styles.dot} />
        Team
      </button>
    </div>
  );
}