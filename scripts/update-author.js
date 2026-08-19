const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const email = (process.env.ADMIN_EMAIL || process.argv[2] || '').toLowerCase()
  const name = process.argv[3] || 'Abhinav'
  if (!email) throw new Error('Provide ADMIN_EMAIL or pass an email argument')

  const user = await prisma.user.update({ where: { email }, data: { name } })
  console.log(`Updated author ${user.email} to name "${user.name}"`)
}

main()
  .catch(error => console.error(error))
  .finally(() => prisma.$disconnect())
