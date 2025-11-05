/**
 * Admin User Setup Script
 * Run this script once to create your first admin user
 * 
 * Usage: node scripts/create-admin.js
 */

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/analyst-website';

// Admin credentials - Loaded from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@localhost.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = 'Admin User';

// User Schema (matching your existing model)
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'admin',
  },
  avatar: String,
}, {
  timestamps: true,
});

async function createAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create User model
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`📧 Email: ${ADMIN_EMAIL}`);
      console.log('💡 If you forgot the password, delete this user and run the script again.');
      process.exit(0);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: ADMIN_NAME,
      role: 'admin',
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('📋 LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════');
    console.log(`📧 Email:    ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log('═══════════════════════════════════');
    console.log('\n🌐 Login URL: http://localhost:3000/admin/login');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('💡 You can delete this script after creating the admin user.\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 11000) {
      console.log('\n💡 User with this email already exists.');
      console.log('   Either use different credentials or delete the existing user.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
createAdminUser();
