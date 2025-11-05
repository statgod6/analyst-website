/**
 * Update Author Name Script
 * Updates all blog authors to "Abhinav"
 * 
 * Usage: node scripts/update-author.js
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

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/analyst-website';

// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  avatar: String,
}, {
  timestamps: true,
});

// Blog Schema
const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: String,
}, {
  timestamps: true,
});

async function updateAuthorName() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

    // Update all users to have the name "Abhinav"
    console.log('👤 Updating all user names to "Abhinav"...');
    const userUpdateResult = await User.updateMany(
      {},
      { $set: { name: 'Abhinav' } }
    );
    
    console.log(`✅ Updated ${userUpdateResult.modifiedCount} user(s)`);

    // Get all blogs with their author info
    const blogs = await Blog.find({}).populate('author');
    console.log(`📝 Found ${blogs.length} blog(s)`);
    
    if (blogs.length > 0) {
      console.log('\n📋 Blog Authors Updated:');
      console.log('═══════════════════════════════════');
      blogs.forEach((blog, index) => {
        const authorName = blog.author?.name || 'Unknown';
        console.log(`${index + 1}. "${blog.title}" - Author: ${authorName}`);
      });
      console.log('═══════════════════════════════════');
    }

    console.log('\n✅ All authors updated to "Abhinav" successfully!');

  } catch (error) {
    console.error('❌ Error updating authors:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
updateAuthorName();
