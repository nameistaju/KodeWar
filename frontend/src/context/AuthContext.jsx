import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'kwt_candidate_token';
const USER_KEY = 'kwt_candidate_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to persist auth state
  const saveSession = (newToken, newUser, newProfile) => {
    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);
    try {
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch (err) {
      console.warn('Storage error saving session:', err);
    }
  };

  // Restore session from token on mount
  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setProfile(data.profile);
        } else {
          // Token expired or invalid
          saveSession(null, null, null);
        }
      } catch (err) {
        console.warn('Could not verify session with backend, keeping cached credentials:', err);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  // Login
  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    saveSession(data.token, data.user, data.profile);
    return data;
  }, []);

  // Signup
  const signup = useCallback(async (fullName, email, password, confirmPassword) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, confirmPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Signup failed. Please check your inputs.');
    }

    saveSession(data.token, data.user, data.profile);
    return data;
  }, []);

  // Google Login
  const loginWithGoogle = useCallback(async (googlePayload) => {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googlePayload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Google sign-in failed.');
    }

    saveSession(data.token, data.user, data.profile);
    return data;
  }, []);

  // Logout
  const logout = useCallback(() => {
    saveSession(null, null, null);
  }, []);

  // Update Profile
  const updateProfile = useCallback(async (profileData) => {
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile.');
    }

    setProfile(data.profile);
    return data.profile;
  }, [token]);

  // Upload Primary Resume
  const uploadResume = useCallback(async (file) => {
    if (!token) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch(`${API_BASE_URL}/profile/resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Resume upload failed (Max 10MB, PDF/DOC/DOCX).');
    }

    setProfile(data.profile);
    return data;
  }, [token]);

  const value = {
    token,
    user,
    profile,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
    uploadResume,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
