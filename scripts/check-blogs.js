const mongoose = require('mongoose')

// MongoDB connection string - update with your actual connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aiforeveryone8011_db_user:rVhC7xjcJGaS2bwI@cluster0.zfi2pyo.mongodb.net/analyst-website?retryWrites=true&w=majority&appName=Cluster0'

// User Schema (needed for populate)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  status: String,
  category: String,
  publishedAt: Date,
  createdAt: Date,
  views: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)

async function checkBlogs() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    // Get all blogs
    const allBlogs = await Blog.find({})
      .populate('author', 'name email')
      .select('title slug status category publishedAt createdAt views author')
      .lean()
    
    console.log(`📊 Total blogs in database: ${allBlogs.length}\n`)

    if (allBlogs.length === 0) {
      console.log('No blogs found in database.')
      await mongoose.connection.close()
      return
    }

    // Display all blogs with details
    console.log('📝 Blog Details:\n')
    console.log('=' .repeat(100))
    
    allBlogs.forEach((blog, index) => {
      console.log(`\n${index + 1}. ${blog.title}`)
      console.log(`   ID: ${blog._id}`)
      console.log(`   Slug: ${blog.slug}`)
      console.log(`   Status: ${blog.status}`)
      console.log(`   Category: ${blog.category || 'N/A'}`)
      console.log(`   Author: ${blog.author?.name || 'Unknown'} (${blog.author?.email || 'N/A'})`)
      console.log(`   Created: ${blog.createdAt ? new Date(blog.createdAt).toLocaleString() : 'N/A'}`)
      console.log(`   Published: ${blog.publishedAt ? new Date(blog.publishedAt).toLocaleString() : 'Not published'}`)
      console.log(`   Views: ${blog.views || 0}`)
    })

    console.log('\n' + '='.repeat(100))

    // Summary by status
    const draftCount = allBlogs.filter(b => b.status === 'draft').length
    const publishedCount = allBlogs.filter(b => b.status === 'published').length
    
    console.log('\n📈 Summary:')
    console.log(`   Draft: ${draftCount}`)
    console.log(`   Published: ${publishedCount}`)
    
    console.log('\n💡 To clean up blogs, run: node scripts/clean-blogs.js')

    await mongoose.connection.close()
    console.log('\n✅ Done!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkBlogs()
