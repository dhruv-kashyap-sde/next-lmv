/**
 * Google OAuth Setup Validator
 * 
 * This script helps validate your Google OAuth configuration
 * Run this to check if everything is set up correctly
 */

const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'MONGODB_URI',
  'JWT_SECRET'
];

const optionalEnvVars = [
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'EMAIL_HOST',
  'EMAIL_USER'
];

function validateSetup() {
  console.log('\n🔍 Validating Google OAuth Setup...\n');
  
  let errors = [];
  let warnings = [];
  let success = [];

  // Check required environment variables
  console.log('📋 Checking Required Environment Variables:');
  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      success.push(`✅ ${varName} is set`);
    } else {
      errors.push(`❌ ${varName} is missing`);
    }
  });

  // Check optional environment variables
  console.log('\n📋 Checking Optional Environment Variables:');
  optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      success.push(`✅ ${varName} is set`);
    } else {
      warnings.push(`⚠️  ${varName} is not set (optional)`);
    }
  });

  // Validate format
  console.log('\n🔍 Validating Configuration Format:');
  
  if (process.env.GOOGLE_CLIENT_ID) {
    if (process.env.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
      success.push('✅ GOOGLE_CLIENT_ID format looks correct');
    } else {
      warnings.push('⚠️  GOOGLE_CLIENT_ID might be incorrect (should end with .apps.googleusercontent.com)');
    }
  }

  if (process.env.NEXTAUTH_URL) {
    try {
      new URL(process.env.NEXTAUTH_URL);
      success.push('✅ NEXTAUTH_URL is a valid URL');
    } catch {
      errors.push('❌ NEXTAUTH_URL is not a valid URL');
    }
  }

  if (process.env.NEXTAUTH_SECRET) {
    if (process.env.NEXTAUTH_SECRET.length >= 32) {
      success.push('✅ NEXTAUTH_SECRET length is adequate');
    } else {
      warnings.push('⚠️  NEXTAUTH_SECRET should be at least 32 characters');
    }
  }

  // Check MongoDB connection
  if (process.env.MONGODB_URI) {
    if (process.env.MONGODB_URI.startsWith('mongodb://') || 
        process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
      success.push('✅ MONGODB_URI format looks correct');
    } else {
      errors.push('❌ MONGODB_URI format is incorrect');
    }
  }

  // Print results
  console.log('\n📊 Validation Results:\n');
  
  if (success.length > 0) {
    console.log('✅ Success:');
    success.forEach(msg => console.log(`   ${msg}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(msg => console.log(`   ${msg}`));
  }

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(msg => console.log(`   ${msg}`));
  }

  // Final verdict
  console.log('\n' + '='.repeat(60));
  if (errors.length === 0) {
    console.log('✅ Configuration looks good! You can proceed with testing.');
    console.log('\n📝 Next Steps:');
    console.log('   1. Start the dev server: npm run dev');
    console.log('   2. Visit: http://localhost:3000/auth-test');
    console.log('   3. Test Google sign-in: http://localhost:3000/login');
    console.log('\n📚 Documentation:');
    console.log('   - Quick Setup: GOOGLE_OAUTH_CHECKLIST.md');
    console.log('   - Detailed Guide: GOOGLE_OAUTH_SETUP.md');
    console.log('   - Implementation: GOOGLE_OAUTH_IMPLEMENTATION.md');
  } else {
    console.log('❌ Configuration has errors. Please fix them before proceeding.');
    console.log('\n📝 To fix:');
    console.log('   1. Copy .env.example to .env.local');
    console.log('   2. Fill in the missing values');
    console.log('   3. Follow GOOGLE_OAUTH_CHECKLIST.md for setup instructions');
  }
  console.log('='.repeat(60) + '\n');

  return errors.length === 0;
}

// Check if running directly
if (require.main === module) {
  validateSetup();
}

module.exports = { validateSetup };
