'use client';

import { useState, useEffect } from 'react';
import styles from './header.module.scss';
import { Icons } from '../../shared/icons';

export default function Header({ isDarkMode, onThemeToggle, onLoginClick, onSignupClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ];

  // Smooth scroll for nav links
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>{'<>'}</span>
          <span className={styles.logoText}>NexCode</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className={styles.navLink}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button 
            className={styles.themeToggle}
            onClick={onThemeToggle}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          
          <button className={styles.loginBtn} onClick={onLoginClick}>
            Log In
          </button>
          
          <button className={styles.signupBtn} onClick={onSignupClick}>
            Get Started
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className={styles.mobileToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburger} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className={styles.mobileNavLink}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
          <button 
            className={styles.mobileLoginBtn} 
            onClick={() => {
              setIsMobileMenuOpen(false);
              onLoginClick();
            }}
          >
            Log In
          </button>
          <button 
            className={styles.mobileSignupBtn} 
            onClick={() => {
              setIsMobileMenuOpen(false);
              onSignupClick();
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}