const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const email = (process.argv[2] || 'test@example.com').toLowerCase()
  const user = await prisma.user.delete({ where: { email } }).catch(() => null)
  console.log(user ? `Deleted user ${email}` : `No user found for ${email}`)
}

main()
  .catch(error => console.error(error))
  .finally(() => prisma.$disconnect())
