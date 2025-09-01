import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: '', // Corrected key to match backend
    last_name: '',  // Corrected key to match backend
    age_group: '',  // Corrected key to match backend
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Sending signup data:', formData);

    try {
      console.log('Making request to:', '/api/auth/signup/');
      const response = await fetch('/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSuccess('Account created successfully! Please log in.');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 2000);
      } else {
        setError(data.message || data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Detailed error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Make sure the backend is running on http://127.0.0.1:8000');
      } else if (err.message.includes('JSON')) {
        setError('Server response format error. Check browser console for details.');
      } else {
        setError(`Network error: ${err.message}`);
      }
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
    signupBox: {
      position: 'relative',
      backgroundColor: 'rgba(28, 28, 28, 0.8)',
      padding: '40px 30px',
      borderRadius: '12px',
      width: '340px',
      textAlign: 'center',
      boxShadow: '0 0 25px rgba(255, 0, 0, 0.6)',
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
      color: '#ff3b3f',
      textAlign: 'center'
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
    select: {
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
    },
    success: {
      color: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '15px',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.overlay}></div>
      <div style={styles.signupBox}>
        <div style={styles.logoContainer}>
          <img src="/static/images/logo.png" alt="App Logo" style={styles.logo} />
        </div>
        <h2 style={styles.title}>Sign Up</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name" // Corrected name to match backend
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            style={styles.input}
            required
          />

          <input
            type="text"
            name="last_name" // Corrected name to match backend
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            style={styles.input}
            required
          />

          <select
            name="age_group" // Corrected name to match backend
            value={formData.age_group}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="" disabled>Select Age Range</option>
            <option value="4-6">4-6 years</option>
            <option value="7-12">7-12 years</option>
            <option value="13+">13+ years</option>
          </select>

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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.paragraph}>
          Already have an account? 
          <span 
            style={styles.link}
            onClick={() => window.location.href = '/signin'}
          > Login</span>
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

export default SignUp;