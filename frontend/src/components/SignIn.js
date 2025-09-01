import React, { useState } from 'react';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Updated handleSubmit in SignIn.js with correct redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // FIXED: Redirect based on user role - stories page for regular users
        if (data.user.is_superadmin) {
          window.location.href = '/admin';  // Admin users go to admin panel
        } else {
          window.location.href = '/stories';  // Regular users go to stories page (not dashboard)
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };
  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      background: 'url("/static/images/background.png") no-repeat center center fixed',
      backgroundSize: 'cover',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0,
      position: 'relative',
      overflow: 'hidden'
    },
    overlay: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(29, 27, 27, 0.6)',
      backdropFilter: 'blur(5px)',
      zIndex: 0
    },
    loginBox: {
      position: 'relative',
      backgroundColor: 'rgba(28, 28, 28, 0.8)',
      padding: '40px 30px',
      borderRadius: '12px',
      width: '320px',
      textAlign: 'center',
      boxShadow: '0 0 25px rgba(255, 59, 63, 0.6)',
      zIndex: 1,
      animation: 'slideBounce 1.2s ease forwards'
    },
    logoContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px'
    },
    logo: {
      width: '150px',
      height: 'auto',
      display: 'block',
      margin: '0 auto'
    },
    title: {
      marginBottom: '20px',
      color: '#ff3b3f'
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      border: 'none',
      borderRadius: '8px',
      background: '#333',
      color: '#fff',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    button: {
      backgroundColor: '#ff3b3f',
      color: '#fff',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      width: '100%',
      marginTop: '10px',
      transition: 'background 0.3s ease'
    },
    buttonHover: {
      backgroundColor: '#ff5f63'
    },
    paragraph: {
      marginTop: '10px',
      fontSize: '13px'
    },
    link: {
      color: '#ff3b3f',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    error: {
      color: '#ff6b6b',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '15px',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.overlay}></div>
      <div style={styles.loginBox}>
        <div style={styles.logoContainer}>
          <img src="/static/images/logo.png" alt="App Logo" style={styles.logo} />
        </div>
        <h2 style={styles.title}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            style={styles.input}
            required
          />
          <button 
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.paragraph}>
          Don't have an account? 
          <span 
            style={styles.link}
            onClick={() => window.location.href = '/signup'}
          > Sign Up</span>
        </p>
      </div>

      <style jsx>{`
        @keyframes slideBounce {
          0% { opacity: 0; transform: translateY(-60px); }
          60% { opacity: 1; transform: translateY(10px); }
          80% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SignIn;