const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const args = process.argv.slice(2)
  if (!args.includes('--delete-drafts')) {
    const draftCount = await prisma.blog.count({ where: { status: 'draft' } })
    console.log(`Draft blogs: ${draftCount}`)
    console.log('Run with --delete-drafts to delete draft blogs.')
    return
  }

  const result = await prisma.blog.deleteMany({ where: { status: 'draft' } })
  console.log(`Deleted ${result.count} draft blogs`)
}

main()
  .catch(error => console.error(error))
  .finally(() => prisma.$disconnect())
