/**
 * Assign Author to All Blogs Script
 * Assigns "Abhinav" as the author for all existing blogs
 * 
 * Usage: node scripts/assign-author-to-blogs.js
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
}, { timestamps: true });

// Blog Schema
const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
}, { timestamps: true });

async function assignAuthorToBlogs() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

    // Find the user "Abhinav"
    const abhinav = await User.findOne({ name: 'Abhinav' });
    
    if (!abhinav) {
      console.log('❌ User "Abhinav" not found!');
      console.log('💡 Run: node scripts/update-author.js first');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`✅ Found user: ${abhinav.name} (${abhinav.email})`);
    console.log(`   User ID: ${abhinav._id}\n`);

    // Update all blogs to have Abhinav as author
    const result = await Blog.updateMany(
      {},
      { $set: { author: abhinav._id } }
    );

    console.log(`📝 Updated ${result.modifiedCount} blog(s) with author: Abhinav`);

    // Verify the update
    const blogs = await Blog.find({}).populate('author', 'name email');
    
    console.log('\n📋 Verification:');
    console.log('═══════════════════════════════════════════════════════════');
    
    blogs.forEach((blog, i) => {
      console.log(`${i + 1}. "${blog.title}"`);
      console.log(`   Author: ${blog.author?.name || 'MISSING'} (${blog.author?.email || 'MISSING'})`);
    });
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n✅ All blogs now have "Abhinav" as the author!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
assignAuthorToBlogs();
