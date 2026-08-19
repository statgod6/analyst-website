import { notFound } from 'next/navigation'
import { prisma, serializeOrder, serializeProduct } from '@/lib/db'
import ReceiptView from '@/components/receipt/ReceiptView'

interface ReceiptPageProps {
  params: {
    orderNumber: string
  }
}

async function getOrderDetails(orderNumber: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { product: true },
    })
    
    if (!order) return null

    return {
      order: serializeOrder(order),
      product: order.product ? serializeProduct(order.product, { includeFileUrl: false }) : null,
    }
  } catch (error) {
    console.error('Error fetching order details:', error)
    return null
  }
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const data = await getOrderDetails(params.orderNumber)

  if (!data || !data.order) {
    notFound()
  }

  return <ReceiptView order={data.order} product={data.product} />
}
