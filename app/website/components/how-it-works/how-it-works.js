import styles from './how-it-works.module.scss';

const steps = [
  {
    number: '01',
    title: 'Create Your Project',
    description: 'Start a new project or import an existing one from GitHub. Name it, set your environment, and invite your team.',
  },
  {
    number: '02',
    title: 'Invite Your Team',
    description: 'Add team members by email and assign roles — View, Edit, or Admin. No technical setup required.',
  },
  {
    number: '03',
    title: 'Code Together',
    description: 'Write, review, and debug code in real-time. See cursors, changes, and presence of your entire team.',
  },
  {
    number: '04',
    title: 'Ship to GitHub',
    description: 'Automatically commit changes to GitHub. Every save is tracked, and you can review history anytime.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.header}>
        <span className={styles.label}>How It Works</span>
        <h2>Get Started in Minutes</h2>
        <p>From setup to shipping — here's how NexCode transforms your workflow.</p>
      </div>

      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.stepNumber}>{step.number}</div>
            <div className={styles.stepContent}>
              <div className={styles.stepConnector} />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}