import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// --------------------------------------------------
// POST /api/leads/digital-marketing
// Submit Digital Marketing Lead Inquiries
// --------------------------------------------------
router.post('/digital-marketing', async (req, res) => {
  try {
    const { companyName, phone, email, businessCategory, address } = req.body;

    if (!companyName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Company name, phone number, and email address are required.',
      });
    }

    const leadRecord = await db.insert('leads', {
      id: 'lead_dm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: 'DIGITAL_MARKETING',
      company_name: companyName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      business_category: businessCategory || 'General',
      address: address ? address.trim() : '',
      created_at: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your business details have been received. Our team will contact you shortly.',
      lead: leadRecord,
    });
  } catch (err) {
    console.error('Digital Marketing Lead submission error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to record inquiry. Please try again later.',
    });
  }
});

// --------------------------------------------------
// POST /api/leads/careers
// Submit Careers & Candidate Talent Lead Inquiries
// --------------------------------------------------
router.post('/careers', async (req, res) => {
  try {
    const { name, phone, institutionName, passingYear, purpose } = req.body;

    if (!name || !phone || !institutionName) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone number, and institution name are required.',
      });
    }

    const leadRecord = await db.insert('leads', {
      id: 'lead_car_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: 'CAREER_TALENT',
      full_name: name.trim(),
      phone: phone.trim(),
      institution_name: institutionName.trim(),
      passing_year: passingYear || '',
      purpose: purpose || 'General Inquiry',
      created_at: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Profile received! Our career squad will reach out with track details.',
      lead: leadRecord,
    });
  } catch (err) {
    console.error('Careers Lead submission error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to record inquiry. Please try again later.',
    });
  }
});

// --------------------------------------------------
// GET /api/leads
// Fetch all submitted leads (Digital Marketing + Careers)
// --------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const leads = await db.get('leads') || [];
    return res.json({
      success: true,
      count: leads.length,
      leads: leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    });
  } catch (err) {
    console.error('Fetch leads error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leads.',
    });
  }
});

export default router;

