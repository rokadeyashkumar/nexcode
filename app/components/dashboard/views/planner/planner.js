import { useState } from 'react';
import styles from './planner.module.scss';

const MOCK_TASKS = [
  {
    id: 1,
    title: 'Setup Authentication System',
    description: 'Implement JWT-based authentication with refresh tokens. Include OAuth for Google and GitHub.',
    assignee: 'Dev',
    assigneeColor: '#1a1a1a',
    time: '2 days ago',
    status: 'in-progress',
    priority: 'high',
    comments: 3,
    attachments: 2,
  },
  {
    id: 2,
    title: 'Design Database Schema',
    description: 'Create PostgreSQL schema for users, projects, files, and permissions.',
    assignee: 'Priya',
    assigneeColor: '#333333',
    time: '1 day ago',
    status: 'to-do',
    priority: 'medium',
    comments: 0,
    attachments: 0,
  },
  {
    id: 3,
    title: 'Implement Real-Time Sync',
    description: 'Set up Yjs WebSocket server and integrate with Monaco editor for live collaboration.',
    assignee: 'Sam',
    assigneeColor: '#555555',
    time: '3 hours ago',
    status: 'completed',
    priority: 'high',
    comments: 5,
    attachments: 3,
  },
  {
    id: 4,
    title: 'Create Dashboard UI',
    description: 'Build the main dashboard with sidebar navigation, recent files, teams view.',
    assignee: 'Dev',
    assigneeColor: '#1a1a1a',
    time: '4 hours ago',
    status: 'in-progress',
    priority: 'medium',
    comments: 2,
    attachments: 1,
  },
  {
    id: 5,
    title: 'Write Unit Tests',
    description: 'Add unit tests for authentication and real-time sync features.',
    assignee: 'Priya',
    assigneeColor: '#333333',
    time: '5 hours ago',
    status: 'to-do',
    priority: 'low',
    comments: 0,
    attachments: 0,
  },
  {
    id: 6,
    title: 'Deploy to Vercel',
    description: 'Set up CI/CD pipeline and deploy the application to Vercel with environment variables.',
    assignee: 'Sam',
    assigneeColor: '#555555',
    time: '1 hour ago',
    status: 'completed',
    priority: 'medium',
    comments: 1,
    attachments: 2,
  },
];

const COLUMNS = [
  { id: 'to-do', label: 'To Do', icon: '○' },
  { id: 'in-progress', label: 'In Progress', icon: '◉' },
  { id: 'completed', label: 'Completed', icon: '✓' },
];

const PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function TaskCard({ task }) {
  return (
    <div className={styles.taskCard}>
      <div className={styles.taskHeader}>
        <span className={`${styles.priorityDot} ${styles[task.priority]}`} />
        <span className={styles.taskId}>#{task.id}</span>
        {task.status === 'completed' && (
          <span className={styles.completedBadge}>✓ Done</span>
        )}
      </div>
      
      <h4 className={styles.taskTitle}>{task.title}</h4>
      <p className={styles.taskDescription}>{task.description}</p>
      
      <div className={styles.taskMeta}>
        <div className={styles.assignee}>
          <span className={styles.assigneeAvatar} style={{ background: task.assigneeColor }}>
            {task.assignee[0]}
          </span>
          <span className={styles.assigneeName}>{task.assignee}</span>
        </div>
        <span className={styles.taskTime}>{task.time}</span>
      </div>
      
      <div className={styles.taskFooter}>
        <div className={styles.taskStats}>
          <span>💬 {task.comments}</span>
          <span>📎 {task.attachments}</span>
        </div>
        <span className={`${styles.priorityTag} ${styles[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
    </div>
  );
}

export default function PlannerView() {
  const [showNewTask, setShowNewTask] = useState(false);

  return (
    <div className={styles.planner}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Planner</h2>
          <span className={styles.taskCount}>{MOCK_TASKS.length} tasks</span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.filterBtn}>🔍 Filter</button>
          <button className={styles.createBtn} onClick={() => setShowNewTask(!showNewTask)}>
            + New Task
          </button>
        </div>
      </div>

      {/* New Task Form */}
      {showNewTask && (
        <div className={styles.newTaskForm}>
          <div className={styles.formRow}>
            <input type="text" placeholder="Task title" className={styles.formInput} />
            <select className={styles.formSelect}>
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <textarea placeholder="Description" className={styles.formTextarea} rows="2" />
          </div>
          <div className={styles.formRow}>
            <input type="text" placeholder="Assignee" className={styles.formInput} />
            <select className={styles.formSelect}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button className={styles.formSubmit}>Add Task</button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className={styles.board}>
        {COLUMNS.map((column) => {
          const tasks = MOCK_TASKS.filter((task) => task.status === column.id);
          return (
            <div key={column.id} className={styles.column}>
              <div className={styles.columnHeader}>
                <span className={styles.columnIcon}>{column.icon}</span>
                <h3>{column.label}</h3>
                <span className={styles.columnCount}>{tasks.length}</span>
              </div>
              <div className={styles.columnTasks}>
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                  <div className={styles.emptyColumn}>
                    <span>No tasks</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}