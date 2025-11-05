/**
 * Verify Blog Authors Script
 * Checks and displays blog author information
 * 
 * Usage: node scripts/verify-blog-authors.js
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

async function verifyAuthors() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Define schemas
    const UserSchema = new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      role: String,
      avatar: String,
    }, { timestamps: true });

    const BlogSchema = new mongoose.Schema({
      title: String,
      slug: String,
      content: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: String,
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

    // Get all users
    const users = await User.find({});
    console.log(`👥 Total Users: ${users.length}`);
    users.forEach((user, i) => {
      console.log(`   ${i + 1}. ${user.name} (${user.email}) - ID: ${user._id}`);
    });

    // Get all blogs with populated author
    console.log('\n📝 Blogs and their authors:');
    console.log('═══════════════════════════════════════════════════════════');
    
    const blogs = await Blog.find({}).populate('author', 'name email');
    
    if (blogs.length === 0) {
      console.log('No blogs found.');
    } else {
      blogs.forEach((blog, i) => {
        console.log(`\n${i + 1}. "${blog.title}"`);
        console.log(`   Slug: ${blog.slug}`);
        console.log(`   Status: ${blog.status}`);
        console.log(`   Author ID: ${blog.author?._id || 'MISSING'}`);
        console.log(`   Author Name: ${blog.author?.name || 'MISSING'}`);
        console.log(`   Author Email: ${blog.author?.email || 'MISSING'}`);
      });
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`\n✅ Total Blogs: ${blogs.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
verifyAuthors();
