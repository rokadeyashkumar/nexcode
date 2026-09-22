'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './hero.module.scss';

// Profile images
const PROFILE_IMAGES = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBXwhoCEkxt-XkGX2QxsIgdpUormzMLq6xJDULn7CBwA&s=10',
  'https://media.istockphoto.com/id/1487286434/photo/portrait-of-young-smiling-female-programmer-sitting-on-her-desk-with-computers-in-an-it-office.jpg?s=612x612&w=0&k=20&c=mAThBKbvD1a8AnQRYe5aF6E48hylcsokjuim4zAc_Ds=',
  'https://preview.redd.it/illustrations-from-the-new-official-naruto-youtube-channel-v0-cahmkkisrjmg1.png?width=640&crop=smart&auto=webp&s=4599ad450f0d3c6e7c50551225fc50dc677a703e',
  'https://ew.com/thmb/WJmSRe4YKGCLkF9iAZGq1CqAFA0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Andrew-Garfield-The-Social-Network-092825-475bfa8b03ce45be85173baa6a1b5bec.jpg',
];

const USER_NAMES = ['Dev', 'Priya', 'Sam', 'Amara'];

export default function Hero({ onGetStarted }) {
  const [cursors, setCursors] = useState([]);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    // Generate 4 cursors with different positions
    const generateCursors = () => {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
      const newCursors = [];

      for (let i = 0; i < 4; i++) {
        newCursors.push({
          id: i,
          x: 10 + (i * 20) + Math.random() * 5,
          y: 15 + (i * 15) + Math.random() * 8,
          targetX: 0,
          targetY: 0,
          color: colors[i % colors.length],
          size: 14,
          blinkSpeed: 0.8 + (i * 0.2),
          userIndex: i,
        });
      }
      return newCursors;
    };

    const initialCursors = generateCursors();
    const cursorsWithTargets = initialCursors.map(cursor => ({
      ...cursor,
      targetX: cursor.x,
      targetY: cursor.y,
    }));
    setCursors(cursorsWithTargets);

    const animateCursors = (timestamp) => {
      const delta = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = timestamp;

      setCursors(prevCursors => {
        return prevCursors.map((cursor) => {
          if (Math.random() < 0.001) {
            const newX = 5 + Math.random() * 85;
            const newY = 8 + Math.random() * 75;
            return {
              ...cursor,
              targetX: newX,
              targetY: newY,
            };
          }

          const dx = cursor.targetX - cursor.x;
          const dy = cursor.targetY - cursor.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 0.1) {
            return cursor;
          }

          const speed = 0.08;
          const moveX = dx * speed * delta * 30;
          const moveY = dy * speed * delta * 30;

          return {
            ...cursor,
            x: cursor.x + moveX,
            y: cursor.y + moveY,
          };
        });
      });

      animationRef.current = requestAnimationFrame(animateCursors);
    };

    animationRef.current = requestAnimationFrame(animateCursors);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const renderCursor = (color, size) => (
    <svg 
      width={size} 
      height={size * 1.5} 
      viewBox="0 0 24 36" 
      fill="none"
      style={{ display: 'block' }}
    >
      <path
        d="M5.5 2.5L5.5 30.5L10.5 22.5L17 29L19.5 26.5L13 20L20.5 18.5L5.5 2.5Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path
        d="M5.5 2.5L5.5 30.5L10.5 22.5L17 29L19.5 26.5L13 20L20.5 18.5L5.5 2.5Z"
        fill="white"
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Now in Beta — Join the waitlist
        </div>
        
        <h1 className={styles.title}>
          Code Together
          <br />
          <span className={styles.highlight}>in Real Time</span>
        </h1>
        
        <p className={styles.subtitle}>
          NexCode is a collaborative code editor that lets you and your team
          write, review, and ship code together — just like Google Docs for developers.
        </p>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={onGetStarted}>
            Get Started Free
            <span className={styles.arrow}>→</span>
          </button>
          <button className={styles.secondaryBtn}>
            <span className={styles.playIcon}>▶</span>
            Watch Demo
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>2.5k+</span>
            <span className={styles.statLabel}>Developers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>1.2k+</span>
            <span className={styles.statLabel}>Teams</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>99.9%</span>
            <span className={styles.statLabel}>Uptime</span>
          </div>
        </div>
      </div>

      <div className={styles.editorPreview}>
        <div className={styles.previewHeader}>
          <div className={styles.windowControls}>
            <span className={styles.control} />
            <span className={styles.control} />
            <span className={styles.control} />
          </div>
          <span className={styles.previewTitle}>main.js — NexCode</span>
          
          {/* Profile Images Stack - Half overlapping with transparent border */}
          <div className={styles.profileStack}>
            {[0, 1, 2, 3].map((index) => (
              <div 
                key={index}
                className={styles.profileImage}
                style={{ 
                  zIndex: 4 - index,
                  marginLeft: index === 0 ? 0 : '-10px'
                }}
              >
                <Image
                  src={PROFILE_IMAGES[index % PROFILE_IMAGES.length]}
                  alt={USER_NAMES[index]}
                  width={28}
                  height={28}
                  className={styles.profileImg}
                  priority={index === 0}
                />
                {/* Online indicator dot */}
                <span className={styles.onlineDot} />
              </div>
            ))}
            <span className={styles.moreUsers}>+2</span>
          </div>
        </div>

        <div className={styles.previewBody}>
          <div className={styles.lineNumbers}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => (
              <span key={n}>{n}</span>
            ))}
          </div>
          
          <div className={styles.codeContent}>
            <div className={styles.codeLine}>
              <span className={styles.keyword}>import</span>
              <span className={styles.string}> React </span>
              <span className={styles.keyword}>from</span>
              <span className={styles.string}> 'react'</span>
              <span className={styles.punctuation}>;</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.keyword}>import</span>
              <span className={styles.string}> { '{' } useState </span>
              <span className={styles.keyword}>from</span>
              <span className={styles.string}> 'react'</span>
              <span className={styles.punctuation}>;</span>
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.keyword}>function</span>
              <span className={styles.function}> App</span>
              <span className={styles.punctuation}>() {'{'}</span>
            </div>
            <div className={styles.codeLine} style={{ paddingLeft: '16px' }}>
              <span className={styles.keyword}>const</span>
              <span className={styles.variable}> [count</span>
              <span className={styles.punctuation}>,</span>
              <span className={styles.variable}> setCount</span>
              <span className={styles.punctuation}>]</span>
              <span className={styles.function}> = useState</span>
              <span className={styles.punctuation}>(0);</span>
            </div>
            <div className={styles.codeLine} style={{ paddingLeft: '16px' }} />
            <div className={styles.codeLine} style={{ paddingLeft: '16px' }}>
              <span className={styles.keyword}>return</span>
              <span className={styles.punctuation}> (</span>
            </div>
            <div className={styles.codeLine} style={{ paddingLeft: '32px' }}>
              <span className={styles.punctuation}>&lt;</span>
              <span className={styles.tag}>div</span>
              <span className={styles.punctuation}>&gt;</span>
            </div>
            <div className={styles.codeLine} style={{ paddingLeft: '48px' }}>
              <span className={styles.punctuation}>&lt;</span>
              <span className={styles.tag}>h1</span>
              <span className={styles.punctuation}>&gt;</span>
              <span className={styles.string}>Hello NexCode</span>
              <span className={styles.punctuation}>&lt;/</span>
              <span className={styles.tag}>h1</span>
              <span className={styles.punctuation}>&gt;</span>
            </div>
            <div className={styles.codeLine} style={{ paddingLeft: '32px' }}>
              <span className={styles.punctuation}>&lt;/</span>
              <span className={styles.tag}>div</span>
              <span className={styles.punctuation}>&gt;</span>
            </div>
            <div className={styles.codeLine} style={{ paddingLeft: '16px' }}>
              <span className={styles.punctuation}>);</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.punctuation}>{'}'}</span>
            </div>
            <div className={styles.codeLine} />
            <div className={styles.codeLine}>
              <span className={styles.keyword}>export</span>
              <span className={styles.keyword}> default</span>
              <span className={styles.function}> App</span>
              <span className={styles.punctuation}>;</span>
            </div>
          </div>

          {/* Multiple Cursors Overlay - Only 4 cursors */}
          <div className={styles.cursorsOverlay}>
            {cursors.map((cursor) => (
              <div
                key={cursor.id}
                className={styles.cursorWrapper}
                style={{
                  left: `${cursor.x}%`,
                  top: `${cursor.y}%`,
                  transform: 'translate(-50%, -50%)',
                  position: 'absolute',
                  pointerEvents: 'none',
                  zIndex: 10,
                  animation: `cursorBlink ${cursor.blinkSpeed}s ease-in-out infinite`,
                }}
              >
                {renderCursor(cursor.color, cursor.size)}
                <div 
                  className={styles.cursorLabel}
                  style={{
                    backgroundColor: cursor.color,
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: '600',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace',
                    opacity: 0.9,
                    pointerEvents: 'none',
                  }}
                >
                  {USER_NAMES[cursor.userIndex % USER_NAMES.length]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}