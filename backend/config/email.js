const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

function buildAlertHTML(data) {
  const { firstName, lastName, email, phone, organisation, service, country, message, createdAt } = data;
  const date = new Date(createdAt).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg', dateStyle: 'full', timeStyle: 'short' });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f0f3f8; color:#0A1628; }
    .wrapper { max-width:620px; margin:40px auto; background:#fff; border-radius:2px; overflow:hidden; box-shadow:0 8px 32px rgba(10,22,40,0.12); }
    .header { background:#0A1628; padding:32px 40px; }
    .header-brand { font-size:22px; font-weight:700; color:#fff; letter-spacing:0.08em; }
    .header-sub { font-size:11px; letter-spacing:0.15em; color:rgba(255,255,255,0.5); text-transform:uppercase; margin-top:4px; }
    .alert-badge { display:inline-block; background:#C8102E; color:#fff; font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; padding:4px 12px; margin-top:16px; }
    .body { padding:40px; }
    .title { font-size:20px; font-weight:700; color:#0A1628; margin-bottom:6px; }
    .subtitle { font-size:13px; color:#8A9BB0; margin-bottom:28px; }
    .field { margin-bottom:18px; }
    .field-label { font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#8A9BB0; margin-bottom:5px; }
    .field-value { font-size:14px; color:#0A1628; font-weight:500; }
    .field-value a { color:#C8102E; text-decoration:none; }
    .divider { border:none; border-top:1px solid #e8edf4; margin:24px 0; }
    .message-box { background:#f0f3f8; border-left:3px solid #C8102E; padding:18px 20px; border-radius:0 2px 2px 0; }
    .message-box p { font-size:14px; line-height:1.75; color:#2d3748; white-space:pre-wrap; }
    .cta { margin-top:28px; text-align:center; }
    .cta a { display:inline-block; background:#C8102E; color:#fff; text-decoration:none; padding:12px 28px; font-size:13px; font-weight:600; letter-spacing:0.06em; border-radius:2px; }
    .footer { background:#f8f9fc; padding:20px 40px; border-top:1px solid #e8edf4; }
    .footer p { font-size:11px; color:#8A9BB0; line-height:1.6; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="header-brand">ACMIP GROUP</div>
    <div class="header-sub">Radiology Serving Africa</div>
    <div class="alert-badge">🔔 New Enquiry Received</div>
  </div>
  <div class="body">
    <div class="title">New Website Enquiry</div>
    <div class="subtitle">Received on ${date} (SAST)</div>
    <div class="grid">
      <div class="field">
        <div class="field-label">Full Name</div>
        <div class="field-value">${firstName} ${lastName}</div>
      </div>
      <div class="field">
        <div class="field-label">Organisation</div>
        <div class="field-value">${organisation || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">Email Address</div>
        <div class="field-value"><a href="mailto:${email}">${email}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Phone Number</div>
        <div class="field-value">${phone || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">Service Interest</div>
        <div class="field-value">${service || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">Country / Region</div>
        <div class="field-value">${country || '—'}</div>
      </div>
    </div>
    <hr class="divider"/>
    <div class="field">
      <div class="field-label">Message</div>
      <div class="message-box"><p>${message}</p></div>
    </div>
    <div class="cta">
      <a href="mailto:${email}?subject=Re: Your ACMIP Group Enquiry">Reply to ${firstName} →</a>
    </div>
  </div>
  <div class="footer">
    <p>This alert was sent automatically from the ACMIP Group website contact form.<br/>Log in to your <a href="${process.env.FRONTEND_URL}/admin/dashboard.html" style="color:#C8102E;">admin dashboard</a> to manage submissions.</p>
  </div>
</div>
</body>
</html>`;
}

async function sendAdminAlert(submissionData) {
  if (!adminEmails.length) return;
  try {
    await transporter.sendMail({
      from: `"ACMIP Website" <${process.env.EMAIL_USER}>`,
      to: adminEmails.join(', '),
      subject: `🔔 New Enquiry — ${submissionData.firstName} ${submissionData.lastName} | ${submissionData.service || 'General'}`,
      html: buildAlertHTML(submissionData)
    });
    console.log('Admin alert sent to:', adminEmails.join(', '));
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

async function sendConfirmationEmail(to, firstName) {
  try {
    await transporter.sendMail({
      from: `"ACMIP Group" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'We received your enquiry — ACMIP Group',
      html: `
<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f3f8;color:#0A1628;}
  .w{max-width:580px;margin:40px auto;background:#fff;box-shadow:0 8px 32px rgba(10,22,40,0.1);}
  .h{background:#0A1628;padding:28px 36px;}
  .hn{font-size:20px;font-weight:700;color:#fff;letter-spacing:0.08em;}
  .hs{font-size:10px;letter-spacing:0.15em;color:rgba(255,255,255,0.45);text-transform:uppercase;margin-top:3px;}
  .b{padding:36px;}
  .b h2{font-size:22px;font-weight:700;margin-bottom:10px;}
  .b p{font-size:14px;line-height:1.8;color:#4a5568;margin-bottom:14px;}
  .divs{background:#f8f9fc;border-left:3px solid #C8102E;padding:14px 18px;margin:20px 0;font-size:13px;color:#0A1628;}
  .f{background:#f8f9fc;padding:18px 36px;border-top:1px solid #e8edf4;font-size:11px;color:#8A9BB0;}
</style>
</head><body>
<div class="w">
  <div class="h"><div class="hn">ACMIP GROUP</div><div class="hs">Radiology Serving Africa</div></div>
  <div class="b">
    <h2>Thank you, ${firstName}.</h2>
    <p>We've received your enquiry and a member of the ACMIP team will be in touch within <strong>1–2 business days</strong>.</p>
    <p>In the meantime, feel free to explore our full range of services on our website.</p>
    <div class="divs">
      <strong>ACMIP Group</strong><br/>
      Advancing Healthcare Infrastructure Across Africa<br/>
      Radiology Serving Africa
    </div>
    <p style="font-size:13px;color:#8A9BB0;">If your matter is urgent, please contact us directly via the details on our website.</p>
  </div>
  <div class="f">© ACMIP Group. This is an automated confirmation — please do not reply to this email.</div>
</div>
</body></html>`
    });
    console.log('Confirmation email sent to:', to);
  } catch (err) {
    console.error('Confirmation email error:', err.message);
  }
}

module.exports = { sendAdminAlert, sendConfirmationEmail };
