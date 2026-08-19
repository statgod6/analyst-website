const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const blogs = await prisma.blog.findMany({ include: { author: true } })
  const missing = blogs.filter(blog => !blog.author)

  console.log(`Blogs checked: ${blogs.length}`)
  console.log(`Blogs missing authors: ${missing.length}`)
  missing.forEach(blog => console.log(`${blog.title} | ${blog.slug}`))
}

main()
  .catch(error => console.error(error))
  .finally(() => prisma.$disconnect())
