# Admin Setup Guide

## How to Create the First Admin

Since admins have elevated privileges, there's a secure process to create the initial admin account:

### Step 1: Set Up Environment Variable

Add this to your `.env.local` file:

```bash
ADMIN_SETUP_SECRET=your-secure-random-secret-key-here
```

**Important**: Use a strong, random string. Generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Access the Admin Setup Page

Navigate to: `http://localhost:3000/admin/setup`

### Step 3: Fill in the Form

- **Full Name**: Your name
- **Email**: Admin email address
- **Password**: Strong password (min 8 characters)
- **Confirm Password**: Same as above
- **Setup Secret Key**: The value from `ADMIN_SETUP_SECRET` in your `.env.local`

### Step 4: Create Admin

Click "Create Admin Account". If successful, you'll be redirected to the admin login page.

### Step 5: Login

Go to: `http://localhost:3000/login?admin=true`

Use your admin credentials to login. You'll be redirected to `/admin/dashboard`.

## Security Notes

1. **One-Time Setup**: The `/api/admin/setup` route automatically disables itself after the first admin is created.

2. **Production**: In production, you should:
   - Use a strong `ADMIN_SETUP_SECRET`
   - Consider completely removing the setup route after initial admin creation
   - Or add IP whitelist restrictions

3. **Additional Admins**: After the first admin is created, additional admins should be created through the admin dashboard (to be implemented).

## Admin vs User Login

- **User Login**: `http://localhost:3000/login`
- **Admin Login**: `http://localhost:3000/login?admin=true`

The login logic checks the `isAdmin` parameter and queries the appropriate collection (Admin or User).

## Dashboard Routes

### Admin Dashboard
- URL: `/admin/dashboard`
- Features:
  - Stats overview (users, vouchers, claims, revenue)
  - Quick actions
  - Recent activity feed
  - Popular vouchers
- Auto-redirect: Non-admins are redirected to user login

### User Dashboard
- URL: `/dashboard`
- Features:
  - Personal stats (claimed vouchers, points, daily claim status)
  - Claimed vouchers list with codes
  - Quick access to browse vouchers
- Auto-redirect: Admins are redirected to admin dashboard

## Layout Behavior

The navbar and footer are **automatically hidden** on dashboard routes:
- `/dashboard` (user dashboard)
- `/admin/*` (all admin routes)

This provides a clean, focused dashboard experience with just the DarkVeil background.

## Current Admin Permissions

The initial admin is created with all permissions:
- `super_admin` - Full access
- `manage_users` - User management
- `manage_vouchers` - Voucher management
- `manage_brands` - Brand management
- `manage_categories` - Category management
- `view_analytics` - Analytics access

## Next Steps

1. Create your first admin via `/admin/setup`
2. Login at `/login?admin=true`
3. Implement admin pages for:
   - User management
   - Voucher management
   - Brand management
   - Category management
   - Analytics
