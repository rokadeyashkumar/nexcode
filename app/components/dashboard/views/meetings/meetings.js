import styles from './meetings.module.scss';

const MOCK_MEETINGS = [
  {
    id: 1,
    title: 'Sprint Planning',
    description: 'Plan the next sprint backlog and assign tasks for the team.',
    time: 'Today, 10:00 AM',
    duration: '1 hour',
    attendees: ['Dev', 'Priya', 'Sam', 'Amara', 'Kai'],
    status: 'upcoming',
    type: 'Team Sync',
    location: 'Conference Room A',
  },
  {
    id: 2,
    title: 'Code Review Session',
    description: 'Review pull requests and discuss code quality improvements.',
    time: 'Today, 2:00 PM',
    duration: '45 min',
    attendees: ['Dev', 'Priya', 'Sam'],
    status: 'upcoming',
    type: 'Code Review',
    location: 'Virtual',
  },
  {
    id: 3,
    title: 'Design Sync',
    description: 'Align on UI/UX design decisions for the new dashboard.',
    time: 'Tomorrow, 11:00 AM',
    duration: '30 min',
    attendees: ['Amara', 'Kai', 'Dev'],
    status: 'scheduled',
    type: 'Design Review',
    location: 'Meeting Room B',
  },
  {
    id: 4,
    title: 'Architecture Review',
    description: 'Review the system architecture and discuss scalability improvements.',
    time: 'Thu, 3:00 PM',
    duration: '1.5 hours',
    attendees: ['Dev', 'Sam', 'Priya'],
    status: 'scheduled',
    type: 'Technical',
    location: 'Conference Room C',
  },
];

function AttendeeAvatar({ name }) {
  return (
    <span className={styles.attendeeAvatar}>
      {name[0]}
    </span>
  );
}

export default function MeetingsView() {
  return (
    <div className={styles.meetings}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Meetings</h2>
          <span className={styles.meetingCount}>{MOCK_MEETINGS.length} scheduled</span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.calendarBtn}>📅 Calendar View</button>
          <button className={styles.createBtn}>+ Schedule Meeting</button>
        </div>
      </div>

      <div className={styles.meetingsGrid}>
        {MOCK_MEETINGS.map((meeting) => (
          <div key={meeting.id} className={styles.meetingCard}>
            <div className={styles.meetingCardHeader}>
              <div className={styles.meetingType}>
                <span className={styles.typeIcon}>📋</span>
                <span className={styles.typeLabel}>{meeting.type}</span>
              </div>
              <span className={`${styles.status} ${styles[meeting.status]}`}>
                {meeting.status === 'upcoming' ? '🔴 Upcoming' : '📅 Scheduled'}
              </span>
            </div>

            <h3 className={styles.meetingTitle}>{meeting.title}</h3>
            <p className={styles.meetingDescription}>{meeting.description}</p>

            <div className={styles.meetingDetails}>
              <div className={styles.detail}>
                <span className={styles.detailIcon}>🕐</span>
                <span>{meeting.time}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailIcon}>⏱</span>
                <span>{meeting.duration}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailIcon}>📍</span>
                <span>{meeting.location}</span>
              </div>
            </div>

            <div className={styles.meetingFooter}>
              <div className={styles.attendees}>
                {meeting.attendees.slice(0, 4).map((name) => (
                  <AttendeeAvatar key={name} name={name} />
                ))}
                {meeting.attendees.length > 4 && (
                  <span className={styles.moreAttendees}>
                    +{meeting.attendees.length - 4}
                  </span>
                )}
              </div>
              <div className={styles.meetingActions}>
                <button className={styles.joinBtn}>Join</button>
                <button className={styles.moreBtn}>⋯</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}