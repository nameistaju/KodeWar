import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './contactPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusMsg({ type: 'error', text: 'Please fill in your name, email, and message.' });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/leads/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({
          type: 'success',
          text: data.message || 'Thank you! Your message has been sent successfully.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.message || 'Failed to submit form.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatusMsg({
        type: 'error',
        text: err.message || 'An error occurred while sending your message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* 1. HERO HEADER */}
      <section className="contact-hero">
        <h1 className="contact-hero-title">Contact Us</h1>
        <div className="contact-breadcrumb">
          <Link to="/">Home</Link>
          <span className="contact-breadcrumb-sep">/</span>
          <span>Contact</span>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN SECTION */}
      <section className="contact-main-section">
        <div className="contact-grid">
          {/* LEFT: FORM CARD */}
          <div className="contact-form-card">
            <div className="contact-form-subtitle">Contact Us</div>
            <h2 className="contact-form-title">Get In Touch</h2>

            {statusMsg.text && (
              <div className={`contact-alert ${statusMsg.type === 'success' ? 'contact-alert-success' : 'contact-alert-error'}`}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="contact-field-group">
                <label className="contact-field-label" htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="contact-input"
                  placeholder="Your Name..."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field-group">
                <label className="contact-field-label" htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="contact-input"
                  placeholder="example@yourmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field-group">
                <label className="contact-field-label" htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  className="contact-input"
                  placeholder="Title..."
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-field-group">
                <label className="contact-field-label" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="contact-textarea"
                  placeholder="Type Here..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Now'}
              </button>
            </form>
          </div>

          {/* RIGHT: INFO GRID & MAP */}
          <div className="contact-info-col">
            <p className="contact-info-desc">
              Partner with KODEWAR Technologies. Whether you are looking to scale software architecture, deploy intelligent AI systems, or drive high-conversion digital marketing, our studio is ready to build with you.
            </p>

            {/* 4 DETAIL CARDS GRID */}
            <div className="contact-details-grid">
              {/* Phone Number */}
              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="contact-detail-title">Phone Number</div>
                <div className="contact-detail-val">
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </div>
              </div>

              {/* Email Address */}
              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="contact-detail-title">Email Address</div>
                <div className="contact-detail-val">
                  <a href="mailto:kodewartechnologies@gmail.com">kodewartechnologies@gmail.com</a>
                </div>
              </div>

              {/* Whatsapp */}
              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <div className="contact-detail-title">Whatsapp</div>
                <div className="contact-detail-val">
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">+91 98765 43210</a>
                </div>
              </div>

              {/* Our Office */}
              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="contact-detail-title">Our Office</div>
                <div className="contact-detail-val">
                  Hitec City, Hyderabad, TG 500081
                </div>
              </div>
            </div>

            {/* GOOGLE MAP EMBED */}
            <div className="contact-map-wrap">
              <iframe
                title="KODEWAR Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.276412089476!2d78.3752!3d17.4474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8c5d69df%3A0x19688ebb55877f8!2sHITEC%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="contact-map-iframe"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. HIRE US NOW CTA BANNER */}
      <section className="contact-cta-section">
        <div className="contact-cta-box">
          <div className="contact-cta-badge">Hire Us Now</div>
          <h2 className="contact-cta-heading">We Are Always Ready To Build Your Next Benchmark</h2>
          <a
            href="#contact-name"
            onClick={() => {
              const el = document.getElementById('contact-name');
              if (el) el.focus();
            }}
            className="contact-cta-btn"
          >
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
}
