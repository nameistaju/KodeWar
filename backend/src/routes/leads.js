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
// GET /api/leads/export
// Download Excel / CSV Spreadsheet of form responses
// --------------------------------------------------
router.get('/export', async (req, res) => {
  try {
    const leads = (await db.get('leads')) || [];
    leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Lead ID',
      'Form Type',
      'Name / Company Name',
      'Phone Number',
      'Email Address',
      'Business Category / Institution',
      'Address / Primary Purpose',
      'Date Submitted (UTC)'
    ];

    const rows = leads.map((lead) => {
      const isDM = lead.type === 'DIGITAL_MARKETING';
      const nameOrCompany = isDM ? lead.company_name : lead.full_name;
      const email = isDM ? lead.email : 'N/A';
      const categoryOrInst = isDM ? lead.business_category : lead.institution_name;
      const addressOrPurpose = isDM ? lead.address : `${lead.purpose || ''} (Passing: ${lead.passing_year || 'N/A'})`;

      return [
        escapeCsv(lead.id),
        escapeCsv(isDM ? 'Digital Marketing' : 'Careers & Talent'),
        escapeCsv(nameOrCompany),
        escapeCsv(lead.phone),
        escapeCsv(email),
        escapeCsv(categoryOrInst),
        escapeCsv(addressOrPurpose),
        escapeCsv(lead.created_at ? new Date(lead.created_at).toLocaleString('en-US', { timeZone: 'UTC' }) : '')
      ].join(',');
    });

    // UTF-8 BOM (\uFEFF) ensures Microsoft Excel auto-detects encoding & column boundaries
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="kodewar_leads_export_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('Export leads error:', err);
    return res.status(500).send('Error generating export file.');
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


