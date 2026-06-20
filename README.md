# ACMIP Group — Full Website

## Project Structure

```
acmip-full/
├── frontend/          ← Static website (deploy to Netlify / Vercel)
│   ├── index.html
│   ├── pages/
│   │   ├── services.html
│   │   ├── about.html
│   │   └── contact.html
│   ├── css/styles.css
│   └── js/
│       ├── main.js
│       └── api.js     ← Set your backend URL here
├── backend/           ← Node.js API (deploy to Vercel / Railway)
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/mailer.js
│   ├── seed.js
│   └── .env.example
└── admin/             ← Admin dashboard (keep in frontend folder)
    └── index.html
```

---

## ── STEP 1: MongoDB Atlas ──

1. Go to https://cloud.mongodb.com → Create free cluster
2. Create a database user (username + password)
3. Whitelist IP: 0.0.0.0/0 (allow all — for Vercel)
4. Get connection string → looks like:
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/acmip`

---

## ── STEP 2: Gmail App Password (for email alerts) ──

1. Log into the Gmail you want to send FROM
2. Enable 2-Factor Authentication
3. Go to Google Account → Security → App Passwords
4. Generate a new app password (select "Mail" + "Other")
5. Copy the 16-character password — this is your SMTP_PASS

---

## ── STEP 3: Deploy Backend to Vercel ──

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

When prompted, set these Environment Variables in Vercel dashboard:
```
MONGODB_URI        = your Atlas connection string
JWT_SECRET         = any long random string (min 32 chars)
JWT_EXPIRES_IN     = 7d
SMTP_HOST          = smtp.gmail.com
SMTP_PORT          = 587
SMTP_USER          = your-gmail@gmail.com
SMTP_PASS          = your-16-char-app-password
ADMIN_EMAIL_1      = Baatile.magopa1@gmail.com
ADMIN_EMAIL_2      = Kenzomanika@gmail.com
FRONTEND_URL       = https://your-frontend-url.vercel.app
NODE_ENV           = production
```

Note your backend URL (e.g. https://acmip-backend.vercel.app)

---

## ── STEP 4: Create Admin Account ──

```bash
cd backend
cp .env.example .env
# Fill in your MONGODB_URI in .env
node seed.js
```

Default credentials:
- Email: baatile.magopa1@gmail.com
- Password: ACMIPAdmin2024!
⚠️  Change password immediately after first login (update in MongoDB Atlas)

---

## ── STEP 5: Update Frontend API URL ──

Open `frontend/js/api.js` and replace:
```js
'https://acmip-backend.vercel.app/api'
```
with your actual Vercel backend URL.

---

## ── STEP 6: Deploy Frontend to Netlify ──

1. Go to https://netlify.com → New site from drag & drop
2. Drag the entire `frontend/` folder into Netlify
3. Your site is live!

OR with Vercel:
```bash
cd frontend
vercel
```

---

## ── STEP 7: Deploy Admin Dashboard ──

Copy `admin/index.html` into your `frontend/` folder as `admin/index.html`
It will be accessible at: https://your-site.netlify.app/admin/

---

## How Email Alerts Work

When someone submits the contact form:
1. Submission is saved to MongoDB
2. Alert email fires to Baatile.magopa1@gmail.com AND Kenzomanika@gmail.com
3. Auto-reply confirmation fires to the person who submitted

---

## Admin Dashboard

URL: https://your-site.com/admin/
- Login with your admin credentials
- View all submissions in a table
- Click any row to see full details
- Reply directly via email link
- Mark as Read / Responded
- Delete submissions
- Red badge shows unread count

---

## Local Development

```bash
# Backend
cd backend
cp .env.example .env  # fill in your values
npm start             # runs on http://localhost:5000

# Frontend
cd frontend
# Open index.html in browser (or use Live Server in VS Code)
```
# final_website
