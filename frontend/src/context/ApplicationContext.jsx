import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ApplicationContext = createContext(null);

export function ApplicationProvider({ children }) {
  const { token, profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Profile completion calculator (0 to 100%)
  const calculateProfileCompletion = useCallback((prof = profile) => {
    if (!prof) return 0;
    let score = 0;

    // Basic Info: 30%
    if (prof.full_name) score += 10;
    if (prof.email) score += 5;
    if (prof.phone) score += 10;
    if (prof.location) score += 5;

    // Education: 20%
    if (prof.college) score += 10;
    if (prof.graduation_year || prof.degree) score += 10;

    // Skills & Experience: 25%
    if (prof.skills && prof.skills.length > 0) score += 15;
    if (prof.experience || prof.current_role) score += 10;

    // Links: 10%
    if (prof.linkedin || prof.github || prof.portfolio) score += 10;

    // Resume Uploaded: 15%
    if (prof.resume_storage_path || prof.resume_filename) score += 15;

    return Math.min(100, score);
  }, [profile]);

  // Fetch candidate's applications
  const fetchApplications = useCallback(async () => {
    if (!token) return [];
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setApplications(data.applications || []);
        return data.applications;
      }
      return [];
    } catch (err) {
      console.error('Error fetching applications:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Get single application
  const getApplication = useCallback(async (appId) => {
    if (!token) throw new Error('Authentication required');
    const res = await fetch(`${API_BASE_URL}/applications/${appId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Application not found');
    }
    return data.application;
  }, [token]);

  // Submit application
  const submitApplication = useCallback(async (applicationData, customResumeFile) => {
    if (!token) throw new Error('Please sign in before submitting an application.');

    const formData = new FormData();
    Object.keys(applicationData).forEach((key) => {
      formData.append(key, applicationData[key]);
    });

    if (customResumeFile) {
      formData.append('resume', customResumeFile);
    }

    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit application.');
    }

    // Refresh applications cache
    setApplications((prev) => [data.application, ...prev]);
    return data.application;
  }, [token]);

  // Download resume for specific application
  const downloadApplicationResume = useCallback(async (appId, filename = 'resume.pdf') => {
    if (!token) throw new Error('Authentication required');
    const res = await fetch(`${API_BASE_URL}/applications/${appId}/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error('Failed to download resume.');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }, [token]);

  const value = {
    applications,
    loading,
    fetchApplications,
    getApplication,
    submitApplication,
    downloadApplicationResume,
    calculateProfileCompletion,
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}

export function useApplications() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return ctx;
}
