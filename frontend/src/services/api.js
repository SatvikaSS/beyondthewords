const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const refreshResponse = await fetch(`${API_BASE}/api/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('access_token', data.access);
          
          // Retry original request
          config.headers.Authorization = `Bearer ${data.access}`;
          return fetch(`${API_BASE}${endpoint}`, config);
        } else {
          // Refresh failed, logout user
          localStorage.clear();
          window.location.href = '/signin';
        }
      }
    }
    
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};