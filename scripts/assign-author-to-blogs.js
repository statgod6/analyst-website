const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || process.argv[2] || '').toLowerCase()
  if (!adminEmail) throw new Error('Provide ADMIN_EMAIL or pass an email argument')

  const author = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!author) throw new Error(`No user found for ${adminEmail}`)

  const result = await prisma.blog.updateMany({
    where: { authorId: null },
    data: { authorId: author.id },
  })

  console.log(`Assigned ${result.count} blogs to ${author.name}`)
}

main()
  .catch(error => console.error(error))
  .finally(() => prisma.$disconnect())
