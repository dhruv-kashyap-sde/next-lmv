# Admin Creation Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: "MONGODB_URI is not defined"
**Solution:**
1. Create `.env.local` file in your project root (same level as `package.json`)
2. Add: `MONGODB_URI=mongodb://localhost:27017/lmv`
3. Restart your dev server: `npm run dev`

### Issue 2: "ADMIN_SETUP_SECRET is not defined"
**Solution:**
1. Generate a secret key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Add to `.env.local`:
   ```
   ADMIN_SETUP_SECRET=your-generated-key-here
   ```
3. Restart dev server

### Issue 3: "Admin already exists"
**Solution:**
The setup route only works once. If you need to reset:
1. Connect to MongoDB
2. Delete the admin collection:
   ```bash
   mongosh
   use lmv
   db.admins.deleteMany({})
   ```
3. Try setup again

### Issue 4: MongoDB Connection Failed
**Solutions:**

**For Local MongoDB:**
1. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```
2. Verify it's running: `mongosh`

**For MongoDB Atlas:**
1. Get your connection string from MongoDB Atlas
2. Replace `<password>` with your actual password
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/lmv`

### Issue 5: "Failed to create admin" (Generic Error)
**Debug Steps:**
1. Check server console/terminal for detailed errors
2. Visit `/api/admin/diagnostic` to see system status
3. Check browser console (F12) for errors
4. Verify all required fields are filled

## Step-by-Step Setup Process

### 1. Environment Setup
```bash
# Create .env.local file
cp .env.local.template .env.local

# Edit .env.local and add:
MONGODB_URI=mongodb://localhost:27017/lmv
ADMIN_SETUP_SECRET=<generate-random-string>
JWT_SECRET=<generate-random-string>
```

### 2. Generate Secrets
```bash
# Generate ADMIN_SETUP_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB
```bash
# Check if MongoDB is running
mongosh

# If not, start it (Windows)
net start MongoDB

# Create database (optional, will be created automatically)
use lmv
```

### 4. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### 5. Run Diagnostics
Visit: `http://localhost:3000/api/admin/diagnostic`

Should show:
```json
{
  "environment": {
    "MONGODB_URI": "✅ Set",
    "JWT_SECRET": "✅ Set",
    "ADMIN_SETUP_SECRET": "✅ Set"
  },
  "database": {
    "connection": "✅ Connected",
    "adminModel": "✅ Loaded",
    "adminExists": "✅ No admin exists"
  }
}
```

### 6. Create Admin
1. Go to: `http://localhost:3000/admin/setup`
2. Fill in the form:
   - Name: Your name
   - Email: Your email
   - Password: Min 8 characters
   - Confirm Password: Same as above
   - Secret Key: Value from `ADMIN_SETUP_SECRET` in `.env.local`
3. Click "Create Admin Account"

### 7. Login
1. Go to: `http://localhost:3000/login?admin=true`
2. Use your email and password
3. You'll be redirected to `/admin/dashboard`

## Verification Commands

```bash
# Check if .env.local exists
ls -la .env.local  # Mac/Linux
dir .env.local     # Windows

# Check MongoDB connection
mongosh --eval "db.adminCommand('ping')"

# Check if admin was created
mongosh lmv --eval "db.admins.find().pretty()"
```

## Error Messages Explained

| Error | Meaning | Solution |
|-------|---------|----------|
| "Please define MONGODB_URI" | Env variable missing | Add to `.env.local` |
| "Invalid secret key" | Wrong ADMIN_SETUP_SECRET | Check `.env.local` value |
| "Admin already exists" | Admin was already created | Delete admin or use login |
| "Failed to connect to MongoDB" | MongoDB not running | Start MongoDB service |
| "Passwords do not match" | Form validation error | Check password fields |
| "Password must be at least 8 characters" | Too short | Use longer password |

## Need More Help?

1. Check terminal/console logs for detailed errors
2. Visit `/api/admin/diagnostic` for system status
3. Verify `.env.local` file exists and has correct values
4. Make sure MongoDB is running
5. Restart your development server after `.env` changes
