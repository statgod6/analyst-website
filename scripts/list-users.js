/**
 * List all users in the database
 */

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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/analyst-website';

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  createdAt: Date,
});

async function listUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const users = await User.find({});

    console.log('👥 Users in database:');
    console.log('═'.repeat(70));
    
    if (users.length === 0) {
      console.log('No users found in database.');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        if (user.createdAt) {
          console.log(`   Created: ${user.createdAt.toLocaleString()}`);
        }
      });
    }
    
    console.log('\n' + '═'.repeat(70));
    console.log(`Total users: ${users.length}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

listUsers();
