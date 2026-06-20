// ── API CONFIG ──
// Change this to your deployed backend URL when you go live
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://acmip-backend.vercel.app/api'; // ← replace with your Vercel backend URL

window.ACMIP_API = API_BASE;
