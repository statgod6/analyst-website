const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  console.log(`Found ${products.length} products\n`)
  products.forEach(product => {
    console.log(`${product.name} | ${product.slug} | ${product.status} | ${product.currency} ${product.price}`)
  })
}

main()
  .catch(error => console.error(error))
  .finally(() => prisma.$disconnect())
