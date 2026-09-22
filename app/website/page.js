'use client';

import { useState } from 'react';
import styles from './website.module.scss';
import Header from './components/header/header';
import Hero from './components/hero/hero';
import Features from './components/features/features';
import HowItWorks from './components/how-it-works/how-it-works';
import CTA from './components/cta/cta';
import Footer from './components/footer/footer';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import { useTheme } from '@/app/hooks/useTheme';

export default function WebsitePage({ onNavigateToDashboard }) {
  const [screen, setScreen] = useState('landing');
  const { isDarkMode, setIsDarkMode, mounted } = useTheme();

  const handleLogin = (email, password) => {
    onNavigateToDashboard();
  };

  const handleSignup = (name, email, password) => {
    onNavigateToDashboard();
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    onNavigateToDashboard();
  };

  if (!mounted) return null;

  if (screen === 'login') {
    return (
      <div className={styles.website} data-theme={isDarkMode ? 'dark' : 'light'}>
        <Login
          onBackToHome={() => setScreen('landing')}
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onSwitchToSignup={() => setScreen('signup')}
        />
      </div>
    );
  }

  if (screen === 'signup') {
    return (
      <div className={styles.website} data-theme={isDarkMode ? 'dark' : 'light'}>
        <Signup
          onBackToHome={() => setScreen('landing')}
          onSignup={handleSignup}
          onGoogleLogin={handleGoogleLogin}
          onSwitchToLogin={() => setScreen('login')}
        />
      </div>
    );
  }

  return (
    <div className={styles.website} data-theme={isDarkMode ? 'dark' : 'light'}>
      <Header
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        onLoginClick={() => setScreen('login')}
        onSignupClick={() => setScreen('signup')}
      />
      <main className={styles.main}>
        <Hero onGetStarted={() => setScreen('signup')} />
        <Features />
        <HowItWorks />
        <CTA onGetStarted={() => setScreen('signup')} />
      </main>
      <Footer />
    </div>
  );
}