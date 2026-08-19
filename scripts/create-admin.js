const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)/)
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '')
    }
  })
}

const prisma = new PrismaClient()
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@localhost.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_NAME = 'Admin User'

async function createAdminUser() {
  try {
    const existingAdmin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL.toLowerCase() } })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log(`📧 Email: ${ADMIN_EMAIL}`)
      return
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL.toLowerCase(),
        password: hashedPassword,
        name: ADMIN_NAME,
        role: 'admin',
      },
    })

    console.log('\n✅ Admin user created successfully!')
    console.log(`📧 Email: ${ADMIN_EMAIL}`)
    console.log('\n🌐 Login URL: http://localhost:3000/admin/login')
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
