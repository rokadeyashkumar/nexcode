'use client';

import { useState } from 'react';
import styles from './auth.module.scss';

export default function Signup({ onBackToHome, onSignup, onSwitchToLogin, onGoogleLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setPasswordError('');
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    onSignup(name, email, password);
  };

  return (
    <div className={styles.authPage}>
      {/* Left Panel — Branding */}
      <div className={styles.authLeft}>
        <button
          type="button"
          className={styles.brandTop}
          onClick={onBackToHome}
          aria-label="Back to NexCode home"
        >
          <span className={styles.brandIcon}>{'<>'}</span>
          <span className={styles.brandName}>NexCode</span>
        </button>

        <div className={styles.brandMiddle}>
          <h1 className={styles.brandHeadline}>
            Join the team.
            <br />
            Start building.
          </h1>
          <p className={styles.brandSub}>
            Create your account and invite collaborators by email with
            view, edit, or admin rights.
          </p>

          <ul className={styles.brandPoints}>
            <li>
              <span className={styles.bullet} />
              Free during beta
            </li>
            <li>
              <span className={styles.bullet} />
              No credit card required
            </li>
            <li>
              <span className={styles.bullet} />
              Sign in with Google or GitHub
            </li>
          </ul>
        </div>

        <div className={styles.brandBottom}>
          <span>Setup takes less than a minute</span>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className={styles.authRight}>
        <div className={styles.formWrapper}>
          <button className={styles.backLink} onClick={onBackToHome}>
            ← Back to home
          </button>

          <div className={styles.formHeader}>
            <h2>Create your account</h2>
            <p>Start collaborating with your team today</p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className={styles.googleBtn}
            onClick={onGoogleLogin}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className={styles.divider}>
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                autoFocus
              />
            </div>

            <div className={styles.field}>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                minLength={8}
              />
            </div>

            <div className={styles.field}>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              {passwordError && (
                <span className={styles.errorMessage}>{passwordError}</span>
              )}
            </div>

            <label className={styles.terms}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              I agree to the <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>
            </label>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className={styles.formFooter}>
            <span>Already have an account?</span>
            <button className={styles.switchBtn} onClick={onSwitchToLogin}>
              Log in
            </button>
          </div>

          <div className={styles.demoNote}>
            ⚡ Demo: Use any email/password to sign up
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}