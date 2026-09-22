import styles from './cta.module.scss';

export default function CTA({ onGetStarted }) {
  return (
    <section id="pricing" className={styles.cta}>
      <div className={styles.content}>
        <h2>Ready to Code Together?</h2>
        <p>Join thousands of developers already shipping faster with NexCode.</p>
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={onGetStarted}>
            Start Free Trial
            <span className={styles.arrow}>→</span>
          </button>
          <button className={styles.secondaryBtn}>Contact Sales</button>
        </div>
      </div>
    </section>
  );
}