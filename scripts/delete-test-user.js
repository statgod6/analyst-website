/**
 * Delete the old test admin user
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
const TEST_EMAIL = 'admin@test.com';

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
});

async function deleteTestUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    const testUser = await User.findOne({ email: TEST_EMAIL });
    
    if (!testUser) {
      console.log(`ℹ️  No user found with email: ${TEST_EMAIL}`);
      console.log('Nothing to delete.\n');
      process.exit(0);
    }

    console.log('🗑️  Deleting test user:');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Name: ${testUser.name}`);
    console.log(`   Role: ${testUser.role}\n`);

    await User.deleteOne({ email: TEST_EMAIL });
    
    console.log('✅ Test user deleted successfully!\n');
    console.log('💡 Only the production admin user remains:');
    console.log('   Email: admin@localhost.com');
    console.log('   Password: admin123\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

deleteTestUser();
