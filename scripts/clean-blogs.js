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

async function cleanBlogs() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    // Get all blogs
    const allBlogs = await Blog.find({})
      .populate('author', 'name email')
      .select('title slug status createdAt publishedAt author')
      .lean()
    
    console.log(`📊 Total blogs in database: ${allBlogs.length}\n`)

    if (allBlogs.length === 0) {
      console.log('No blogs found in database.')
      await mongoose.connection.close()
      return
    }

    // Display all blogs
    console.log('📝 Current blogs in database:')
    console.log('='.repeat(80))
    allBlogs.forEach((blog, index) => {
      console.log(`\n${index + 1}. ${blog.title}`)
      console.log(`   Slug: ${blog.slug}`)
      console.log(`   Status: ${blog.status}`)
      console.log(`   Author: ${blog.author?.name || 'Unknown'}`)
      console.log(`   Created: ${blog.createdAt ? new Date(blog.createdAt).toLocaleString() : 'N/A'}`)
    })
    console.log('\n' + '='.repeat(80))

    // Check for command line arguments
    const args = process.argv.slice(2)
    
    if (args.includes('--confirm-delete-all')) {
      console.log('\n🗑️  Deleting ALL blogs...')
      const result = await Blog.deleteMany({})
      console.log(`✅ Deleted ${result.deletedCount} blog posts\n`)
    } else if (args.includes('--delete-slug')) {
      const slugIndex = args.indexOf('--delete-slug')
      const slugToDelete = args[slugIndex + 1]
      
      if (!slugToDelete) {
        console.log('\n❌ Please provide a slug to delete')
        console.log('   Usage: node scripts/clean-blogs.js --delete-slug your-slug-here')
      } else {
        const result = await Blog.deleteOne({ slug: slugToDelete })
        if (result.deletedCount > 0) {
          console.log(`\n✅ Deleted blog with slug: ${slugToDelete}`)
        } else {
          console.log(`\n❌ No blog found with slug: ${slugToDelete}`)
        }
      }
    } else if (args.includes('--delete-drafts')) {
      console.log('\n🗑️  Deleting all draft blogs...')
      const result = await Blog.deleteMany({ status: 'draft' })
      console.log(`✅ Deleted ${result.deletedCount} draft blog posts\n`)
    } else {
      console.log('\n💡 Usage:')
      console.log('   To view all blogs:')
      console.log('   → node scripts/clean-blogs.js')
      console.log('')
      console.log('   To delete all blogs:')
      console.log('   → node scripts/clean-blogs.js --confirm-delete-all')
      console.log('')
      console.log('   To delete a specific blog by slug:')
      console.log('   → node scripts/clean-blogs.js --delete-slug your-blog-slug')
      console.log('')
      console.log('   To delete all draft blogs:')
      console.log('   → node scripts/clean-blogs.js --delete-drafts')
      console.log('')
      console.log('⚠️  WARNING: Deletion is permanent and cannot be undone!')
    }

    await mongoose.connection.close()
    console.log('✅ Done!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

cleanBlogs()
