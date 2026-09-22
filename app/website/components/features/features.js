import styles from './features.module.scss';
import { Icons } from '../../shared/icons';

const features = [
  {
    icon: <Icons.Recent />,
    title: 'Real-Time Collaboration',
    description: 'Write code together with your team in real-time, just like Google Docs for developers.',
  },
  {
    icon: <Icons.Users />,
    title: 'Role-Based Access',
    description: 'Control who can view, edit, or admin your projects with granular permissions.',
  },
  {
    icon: <Icons.Calendar />,
    title: 'Live Presence',
    description: 'See who\'s online, what file they\'re editing, and where their cursor is in real-time.',
  },
  {
    icon: <Icons.Folder />,
    title: 'GitHub Integration',
    description: 'Automatically sync your code with GitHub — every save is a commit.',
  },
  {
    icon: <Icons.Planner />,
    title: 'Task Management',
    description: 'Built-in Kanban board to track tasks, assign work, and manage sprints.',
  },
  {
    icon: <Icons.Settings />,
    title: 'Customizable Workflow',
    description: 'Configure your environment, themes, and preferences to match your workflow.',
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.header}>
        <span className={styles.label}>Features</span>
        <h2>Everything You Need to Code Together</h2>
        <p>NexCode combines the power of a modern code editor with real-time collaboration tools.</p>
      </div>

      <div className={styles.grid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.iconWrapper}>{feature.icon}</div>
            <h3 className={styles.title}>{feature.title}</h3>
            <p className={styles.description}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}