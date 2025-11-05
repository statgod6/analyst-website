import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import ReceiptView from '@/components/receipt/ReceiptView'

interface ReceiptPageProps {
  params: {
    orderNumber: string
  }
}

async function getOrderDetails(orderNumber: string) {
  try {
    await dbConnect()
    const orderData = await Order.findOne({ orderNumber }).lean()
    
    if (!orderData || Array.isArray(orderData)) return null

    // Type assertion for single document
    const order: any = orderData

    const product = await Product.findById(order.productId).lean()

    return {
      order: JSON.parse(JSON.stringify(order)),
      product: product ? JSON.parse(JSON.stringify(product)) : null,
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
