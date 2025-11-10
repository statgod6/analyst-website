const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aiforeveryone8011_db_user:rVhC7xjcJGaS2bwI@cluster0.zfi2pyo.mongodb.net/analyst-website?retryWrites=true&w=majority&appName=Cluster0'

const productSchema = new mongoose.Schema({
  name: String,
  type: String,
  status: String,
  createdAt: Date,
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

async function checkProducts() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    const distinctTypes = await Product.distinct('type')
    console.log('📂 Distinct product types:', distinctTypes)

    const typeCounts = await Product.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    console.log('\n📊 Product type counts:')
    typeCounts.forEach((t) => {
      console.log(`   ${t._id || 'N/A'}: ${t.count}`)
    })

    const args = process.argv.slice(2)
    const allowedTypes = ['ai-prompts', 'ai-guides', 'ai-agents', 'ai-automation', 'ai-templates']
    const defaultType = 'ai-guides'
    if (args.includes('--normalize-types')) {
      console.log('\n🛠️  Normalizing product types to AI-only...')
      const normalizeResult = await Product.updateMany(
        { type: { $nin: allowedTypes } },
        { $set: { type: defaultType } }
      )
      console.log(`✅ Updated ${normalizeResult.modifiedCount} products to "${defaultType}" for non-AI types`)
    }

    const products = await Product.find({}).select('name type status createdAt').lean()
    console.log(`\n📝 Total products: ${products.length}`)

    products.slice(0, 20).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} | type=${p.type} | status=${p.status}`)
    })

    await mongoose.connection.close()
    console.log('\n✅ Done!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkProducts()
