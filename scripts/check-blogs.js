const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const blogs = await prisma.blog.findMany({ include: { author: true }, orderBy: { createdAt: 'desc' } })
  console.log(`Found ${blogs.length} blogs\n`)
  blogs.forEach(blog => {
    console.log(`${blog.title} | ${blog.slug} | ${blog.status} | author: ${blog.author?.name || 'none'}`)
  })
}

main()
  .catch(error => console.error(error))
  .finally(() => prisma.$disconnect())
