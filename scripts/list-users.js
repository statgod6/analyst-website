const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  console.log(`Found ${users.length} users\n`)
  users.forEach(user => {
    console.log(`${user.name} | ${user.email} | ${user.role}`)
  })
}

main()
  .catch(error => console.error(error))
  .finally(() => prisma.$disconnect())
