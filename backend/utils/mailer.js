const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const adminAlertHTML = (d) => `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f3f8;margin:0;padding:0}
.w{max-width:620px;margin:30px auto;background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)}
.h{background:#0A1628;padding:32px 36px}.h h1{color:#fff;margin:0;font-size:22px;font-weight:400;letter-spacing:1px}
.h p{color:rgba(255,255,255,.5);margin:6px 0 0;font-size:13px}
.badge{background:#C8102E;color:#fff;display:inline-block;padding:4px 12px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;border-radius:2px}
.b{padding:32px 36px}.field{margin-bottom:16px;border-bottom:1px solid #f0f3f8;padding-bottom:16px}
.field:last-of-type{border-bottom:none}.lbl{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#8A9BB0;margin-bottom:4px}
.val{font-size:15px;color:#0A1628;font-weight:500}
.msg{background:#f0f3f8;padding:16px;border-left:3px solid #C8102E;font-size:14px;color:#333;line-height:1.7;margin-top:8px}
.btn{display:inline-block;margin-top:20px;background:#C8102E;color:#fff;padding:12px 28px;text-decoration:none;font-size:13px;font-weight:600;border-radius:2px}
.ft{background:#f8f9fc;padding:20px 36px;font-size:12px;color:#8A9BB0;border-top:1px solid #e8ecf2}
</style></head><body><div class="w">
<div class="h"><h1>ACMIP GROUP</h1><p>New website enquiry received</p></div>
<div class="b">
<div class="badge">🔔 New Enquiry</div>
<div class="field"><div class="lbl">From</div><div class="val">${d.firstName} ${d.lastName}</div></div>
<div class="field"><div class="lbl">Email</div><div class="val"><a href="mailto:${d.email}" style="color:#C8102E">${d.email}</a></div></div>
${d.phone ? `<div class="field"><div class="lbl">Phone</div><div class="val">${d.phone}</div></div>` : ''}
${d.organisation ? `<div class="field"><div class="lbl">Organisation</div><div class="val">${d.organisation}</div></div>` : ''}
<div class="field"><div class="lbl">Service of Interest</div><div class="val">${d.service || 'General Enquiry'}</div></div>
${d.country ? `<div class="field"><div class="lbl">Country / Region</div><div class="val">${d.country}</div></div>` : ''}
<div class="field"><div class="lbl">Message</div><div class="msg">${d.message.replace(/\n/g,'<br/>')}</div></div>
<a href="mailto:${d.email}?subject=Re: Your ACMIP Group Enquiry" class="btn">Reply to ${d.firstName} →</a>
</div>
<div class="ft">Received: ${new Date().toLocaleString('en-ZA',{timeZone:'Africa/Johannesburg'})} SAST &nbsp;|&nbsp; ACMIP Group Website</div>
</div></body></html>`;

const autoReplyHTML = (firstName) => `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f3f8;margin:0;padding:0}
.w{max-width:580px;margin:30px auto;background:#fff;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)}
.h{background:#0A1628;padding:36px;text-align:center}
.h h1{color:#fff;margin:0 0 6px;font-size:26px;font-weight:300;letter-spacing:3px}
.h p{color:rgba(255,255,255,.5);margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase}
.b{padding:40px 36px;text-align:center}
.b h2{color:#0A1628;font-size:22px;font-weight:400;margin:0 0 16px}
.b p{color:#5a6a80;font-size:14px;line-height:1.8;margin:0 0 12px}
hr{border:none;border-top:1px solid #f0f3f8;margin:28px 0}
.sv{text-align:left;background:#f8f9fc;padding:20px 24px}
.sv p{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#8A9BB0;margin:0 0 12px}
.sv ul{margin:0;padding:0 0 0 16px;color:#0A1628;font-size:13px;line-height:2}
.ft{background:#f0f3f8;padding:20px 36px;text-align:center;font-size:11px;color:#8A9BB0}
.red{color:#C8102E;font-weight:600}
</style></head><body><div class="w">
<div class="h"><h1>ACMIP</h1><p>Radiology Serving Africa</p></div>
<div class="b">
<div style="font-size:48px;margin-bottom:16px">✅</div>
<h2>Thank you, ${firstName}.</h2>
<p>Your message has been received. A member of the ACMIP team will review your enquiry and get back to you within <span class="red">1–2 business days</span>.</p>
<p>We look forward to exploring how we can support your healthcare infrastructure needs.</p>
<hr/>
<div class="sv"><p>Our Divisions</p><ul>
<li>Healthcare &amp; Medical Imaging Solutions</li>
<li>Advisory &amp; Consulting Services</li>
<li>Construction &amp; Building Services</li>
<li>Renewable Energy &amp; Water Solutions</li>
</ul></div>
</div>
<div class="ft">© ${new Date().getFullYear()} ACMIP Group &nbsp;|&nbsp; Advancing Healthcare Infrastructure Across Africa</div>
</div></body></html>`;

async function sendAdminAlert(data) {
  const to = [process.env.ADMIN_EMAIL_1, process.env.ADMIN_EMAIL_2].filter(Boolean).join(', ');
  await transporter.sendMail({
    from: `"ACMIP Website" <${process.env.SMTP_USER}>`,
    to,
    subject: `🔔 New Enquiry — ${data.firstName} ${data.lastName} (${data.service || 'General'})`,
    html: adminAlertHTML(data)
  });
}

async function sendAutoReply(data) {
  await transporter.sendMail({
    from: `"ACMIP Group" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: `We've received your enquiry — ACMIP Group`,
    html: autoReplyHTML(data.firstName)
  });
}

module.exports = { sendAdminAlert, sendAutoReply };
