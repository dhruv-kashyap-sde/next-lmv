# LMV - Voucher Platform Setup Guide

## 🚀 Getting Started

This platform allows users to claim one voucher per day by watching advertisements. It includes complete authentication with email verification and Google OAuth.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- Google Cloud Console account (for OAuth)
- Gmail account (for email verification)

## 🔧 Installation

1. **Clone and Install Dependencies**
```bash
npm install
```

2. **Set Up Environment Variables**
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

3. **Configure MongoDB**
   - **Local MongoDB**: Use `mongodb://localhost:27017/lmv`
   - **MongoDB Atlas**: 
     - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Create a cluster
     - Get your connection string
     - Replace `<password>` with your database password

4. **Configure Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://yourdomain.com/api/auth/callback/google`
   - Copy Client ID and Client Secret to `.env.local`

5. **Configure Email (Gmail)**
   - Enable 2-Step Verification on your Gmail account
   - Generate App Password:
     - Go to Google Account Settings
     - Security → 2-Step Verification → App passwords
     - Generate password for "Mail"
   - Use this app password in `EMAIL_PASSWORD`

6. **Generate Secrets**
```bash
# For JWT_SECRET and NEXTAUTH_SECRET, generate random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

7. **Set Up Google reCAPTCHA (Optional but Recommended)**
   - Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
   - Register your site (use v2 Checkbox)
   - Add your domains
   - Copy Site Key and Secret Key to `.env.local`

## 📁 Database Schemas

### User Schema
- Supports both credential and Google OAuth authentication
- Email verification with tokens
- Points system for watching ads
- One voucher claim per day restriction
- Tracks claimed vouchers history

### Admin Schema
- Separate authentication for admins
- Permission-based access control
- Activity tracking

### Voucher Schema
- Multiple discount types (percentage, fixed, freebie)
- Expiry dates and redemption limits
- Brand and category associations
- Analytics tracking (clicks, claims)

### Brand & Category Schemas
- Organized voucher management
- Featured brands support
- Active/inactive status

### AdView Schema
- Tracks user ad viewing
- Points earned per ad
- Analytics data

## 🔐 Authentication Features

### User Authentication
- ✅ Email & Password signup with validation
- ✅ Google OAuth integration
- ✅ Email verification (24-hour token)
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens with 6-hour sessions
- ✅ HTTP-only cookies for security
- ✅ reCAPTCHA protection (optional)

### Admin Authentication
- ✅ Separate admin login portal
- ✅ Role-based permissions
- ✅ Secure password hashing
- ✅ Session tracking

## 🛣️ API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User/Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify-email` - Email verification
- `GET /api/auth/me` - Get current user (protected)
- `GET|POST /api/auth/[...nextauth]` - NextAuth routes (Google OAuth)

## 📄 Pages

### User Pages
- `/login` - User login page
- `/login?admin=true` - Admin login page
- `/signup` - User registration
- `/verify-email` - Email verification page
- `/` - Home page (vouchers listing)

### Protected Routes (To be implemented)
- `/dashboard` - User dashboard
- `/admin/dashboard` - Admin dashboard
- `/vouchers` - Browse vouchers
- `/profile` - User profile

## 🔒 Middleware & Security

- `withAuth()` - Protects API routes
- `setAuthCookie()` - Secure cookie management
- `clearAuthCookie()` - Cookie cleanup
- Password hashing with bcrypt (10 rounds)
- JWT token verification
- Email verification required for full access

## 🚀 Running the Application

### Development
```bash
npm run dev
```
Visit `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📝 Usage Flow

1. **User Registration**
   - User signs up with email/password or Google
   - Verification email sent
   - User verifies email via link
   - Account activated

2. **User Login**
   - Login with credentials or Google
   - JWT token issued (6 hours)
   - Redirected to home/dashboard

3. **Claiming Vouchers** (To be implemented)
   - Watch advertisement
   - Earn points
   - Check if can claim today
   - Select and claim voucher
   - Voucher code revealed

4. **Admin Management** (To be implemented)
   - Admin login via `/login?admin=true`
   - Manage vouchers, brands, categories
   - View analytics
   - Manage users

## 🔍 Key Methods

### User Model Methods
```javascript
user.comparePassword(password)  // Compare hashed password
user.canClaimToday()           // Check if user can claim voucher
```

### Voucher Model Methods
```javascript
voucher.isValid()              // Check if voucher is valid
voucher.incrementRedemptions() // Increment redemption count
```

## 📦 Dependencies

### Core
- `next` - React framework
- `mongoose` - MongoDB ODM
- `next-auth` - Authentication
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing

### UI
- `@radix-ui/*` - UI components
- `tailwindcss` - Styling
- `lucide-react` - Icons

### Email & Captcha
- `nodemailer` - Email sending
- `react-google-recaptcha` - Captcha

## 🎨 Styling

- TailwindCSS for styling
- Shadcn/ui components
- Custom gradient backgrounds
- Responsive design
- Dark theme

## 🔄 Next Steps

1. Implement voucher browsing and claiming
2. Create admin dashboard
3. Add ad watching functionality
4. Implement points system
5. Add user profile management
6. Create voucher management (admin)
7. Add analytics dashboard
8. Implement password reset
9. Add rate limiting
10. Set up email templates

## 📞 Support

For issues or questions, please check the documentation or create an issue.

## 📄 License

This project is private and confidential.
