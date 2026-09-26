'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import styles from './terminal.module.scss';

export default function TerminalComponent({ onClose, initialCommand, runMode = 'own' }) {
  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);
  const fitAddon = useRef(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: 'JetBrains Mono, monospace',
      theme: {
        background: '#1a1a1a',
        foreground: '#e8e8e8',
        cursor: '#e8e8e8',
        black: '#1a1a1a',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#bd93f9',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#f8f8f2',
        brightBlack: '#555555',
        brightRed: '#ff5555',
        brightGreen: '#50fa7b',
        brightYellow: '#f1fa8c',
        brightBlue: '#bd93f9',
        brightMagenta: '#ff79c6',
        brightCyan: '#8be9fd',
        brightWhite: '#ffffff',
      },
      rows: 20,
      cols: 80,
    });

    const fitAddonInstance = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddonInstance);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);
    fitAddonInstance.fit();

    terminalInstance.current = term;
    fitAddon.current = fitAddonInstance;

    // Welcome
    const modeLabel = runMode === 'own' ? 'OWN (your code only)' : 'TEAM (merged code)';
    term.writeln('\x1b[1;32m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
    term.writeln('\x1b[1;32m║  Welcome to NexCode Terminal                                ║\x1b[0m');
    term.writeln(`\x1b[1;32m║  Mode: ${modeLabel.padEnd(53)}║\x1b[0m`);
    term.writeln('\x1b[1;32m╚══════════════════════════════════════════════════════════════╝\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[1;33mAvailable commands:\x1b[0m');
    term.writeln('  \x1b[36mhelp\x1b[0m     - Show this help message');
    term.writeln('  \x1b[36mclear\x1b[0m    - Clear the terminal');
    term.writeln('  \x1b[36mls\x1b[0m       - List files');
    term.writeln('  \x1b[36mcat\x1b[0m      - View file contents');
    term.writeln('  \x1b[36mecho\x1b[0m     - Echo text');
    term.writeln('  \x1b[36mwhoami\x1b[0m   - Show current user');
    term.writeln('  \x1b[36mnode\x1b[0m     - Run JS (usage: node <code>)');
    term.writeln('');
    term.write('\x1b[1;32m$ \x1b[0m');

    let commandBuffer = '';

    const handleKey = (key, ev) => {
      const char = key;

      if (ev.keyCode === 13) {
        ev.preventDefault();
        const command = commandBuffer.trim();
        if (command) {
          setCommandHistory((prev) => [...prev, command]);
          executeCommand(command, term);
        }
        commandBuffer = '';
        term.write('\r\n\x1b[1;32m$ \x1b[0m');
      } else if (ev.keyCode === 8) {
        ev.preventDefault();
        if (commandBuffer.length > 0) {
          commandBuffer = commandBuffer.slice(0, -1);
          term.write('\b \b');
        }
      } else if (ev.keyCode === 38) {
        ev.preventDefault();
        if (commandHistory.length > 0) {
          const idx = historyIndex < 0 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(idx);
          for (let i = 0; i < commandBuffer.length; i++) term.write('\b \b');
          commandBuffer = commandHistory[idx] || '';
          term.write(commandBuffer);
        }
      } else if (ev.keyCode === 40) {
        ev.preventDefault();
        if (historyIndex >= 0) {
          const idx = Math.min(commandHistory.length - 1, historyIndex + 1);
          setHistoryIndex(idx);
          for (let i = 0; i < commandBuffer.length; i++) term.write('\b \b');
          commandBuffer = commandHistory[idx] || '';
          term.write(commandBuffer);
        }
      } else if (char && !ev.ctrlKey && !ev.metaKey) {
        commandBuffer += char;
        term.write(char);
      }
    };

    term.onKey(handleKey);

    // Resize handling — both window resize and container resize
    const handleResize = () => {
      try {
        fitAddonInstance.fit();
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('resize', handleResize);

    // Also refit when the parent container changes size (drag-to-resize)
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(terminalRef.current);

    if (initialCommand) {
      setTimeout(() => {
        term.write('\r\n');
        executeCommand(initialCommand, term);
        term.write('\r\n\x1b[1;32m$ \x1b[0m');
      }, 500);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      term.dispose();
    };
  }, []);

  const executeCommand = (command, term) => {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        term.writeln('\r\n\x1b[1;33mAvailable commands:\x1b[0m');
        term.writeln('  \x1b[36mhelp\x1b[0m     - Show this help message');
        term.writeln('  \x1b[36mclear\x1b[0m    - Clear the terminal');
        term.writeln('  \x1b[36mls\x1b[0m       - List files');
        term.writeln('  \x1b[36mcat\x1b[0m      - View file contents');
        term.writeln('  \x1b[36mecho\x1b[0m     - Echo text');
        term.writeln('  \x1b[36mwhoami\x1b[0m   - Show current user');
        term.writeln('  \x1b[36mdate\x1b[0m     - Show current date/time');
        term.writeln('  \x1b[36mpwd\x1b[0m      - Show working directory');
        term.writeln('  \x1b[36mnode\x1b[0m     - Run JS (usage: node <code>)');
        break;

      case 'clear':
        term.clear();
        break;

      case 'ls':
        term.writeln('\r\n\x1b[1;34mFiles in current directory:\x1b[0m');
        term.writeln('  \x1b[36mmain.js\x1b[0m');
        term.writeln('  \x1b[36mutils.js\x1b[0m');
        term.writeln('  \x1b[36mserver.js\x1b[0m');
        term.writeln('  \x1b[36mstyles.css\x1b[0m');
        term.writeln('  \x1b[33mREADME.md\x1b[0m');
        break;

      case 'cat':
        if (args.length === 0) {
          term.writeln('\r\n\x1b[31mError: Please specify a file name\x1b[0m');
        } else {
          term.writeln(`\r\n\x1b[1;34m=== ${args[0]} ===\x1b[0m`);
          term.writeln('  // Sample file content');
          term.writeln('  console.log("Hello from ' + args[0] + '");');
        }
        break;

      case 'echo':
        term.writeln('\r\n' + args.join(' '));
        break;

      case 'whoami':
        term.writeln('\r\n\x1b[1;32mdev\x1b[0m');
        break;

      case 'date':
        term.writeln('\r\n' + new Date().toString());
        break;

      case 'pwd':
        term.writeln('\r\n\x1b[1;36m/project/nexcode\x1b[0m');
        break;

      case 'node':
        if (args.length === 0) {
          term.writeln('\r\n\x1b[31mError: Please provide JavaScript code\x1b[0m');
        } else {
          const code = args.join(' ');
          try {
            // eslint-disable-next-line no-eval
            const result = eval(code);
            term.writeln('\r\n\x1b[1;32mResult: ' + result + '\x1b[0m');
          } catch (error) {
            term.writeln('\r\n\x1b[31mError: ' + error.message + '\x1b[0m');
          }
        }
        break;

      default:
        term.writeln(`\r\n\x1b[31mCommand not found: ${cmd}\x1b[0m`);
        term.writeln(`  Type \x1b[36mhelp\x1b[0m for available commands`);
        break;
    }
  };

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalControls}>
          <span
            className={styles.controlBtn}
            onClick={onClose}
            title="Close terminal"
          >
            ✕
          </span>
        </div>
        <span className={styles.terminalTitle}>Terminal</span>
        <span className={styles.terminalStatus}>● Connected</span>
      </div>
      <div className={styles.terminalBody}>
        <div ref={terminalRef} className={styles.terminal} />
      </div>
    </div>
  );
}