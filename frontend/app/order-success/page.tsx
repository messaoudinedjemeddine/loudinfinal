'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Phone, 
  Mail,
  Home,
  ShoppingBag,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  image?: string
}

interface OrderDetails {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  deliveryType: string
  deliveryAddress: string
  wilayaId: number
  deliveryDeskName: string
  notes: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  orderDate: string
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get order details from localStorage
    const storedOrderDetails = localStorage.getItem('lastOrderDetails')
    if (storedOrderDetails) {
      try {
        const parsedDetails = JSON.parse(storedOrderDetails)
        setOrderDetails(parsedDetails)
      } catch (error) {
        console.error('Error parsing order details:', error)
      }
    }
  }, [])

  const generatePDFReceipt = async () => {
    if (!orderDetails) return
    
    setIsGeneratingPDF(true)
    try {
      const doc = new jsPDF()
      
      // Add Loud Brands logo/header
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('LOUD BRANDS', 105, 20, { align: 'center' })
      
      // Add subtitle
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('Traditional Modern Fashion', 105, 30, { align: 'center' })
      
      // Add receipt title
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('ORDER RECEIPT', 105, 45, { align: 'center' })
      
      // Add order details
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Order Number: ${orderDetails.orderNumber}`, 20, 60)
      doc.text(`Date: ${new Date(orderDetails.orderDate).toLocaleDateString()}`, 20, 70)
      doc.text(`Time: ${new Date(orderDetails.orderDate).toLocaleTimeString()}`, 20, 80)
      
      // Add customer info section
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Customer Information', 20, 100)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Name: ${orderDetails.customerName}`, 20, 110)
      doc.text(`Phone: ${orderDetails.customerPhone}`, 20, 120)
      doc.text(`Email: ${orderDetails.customerEmail || 'N/A'}`, 20, 130)
      
      // Add delivery information
      const deliveryInfo = orderDetails.deliveryType === 'HOME_DELIVERY' 
        ? `Address: ${orderDetails.deliveryAddress}`
        : `Pickup: ${orderDetails.deliveryDeskName}`
      doc.text(deliveryInfo, 20, 140)
      
      // Add order summary
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Order Summary', 20, 160)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      // Add items
      let yPosition = 170
      orderDetails.items.forEach((item, index) => {
        const itemText = `${item.name} (${item.quantity}x) - ${item.price.toFixed(2)} DA`
        if (item.size) {
          doc.text(`${itemText} - Size: ${item.size}`, 20, yPosition)
        } else {
          doc.text(itemText, 20, yPosition)
        }
        yPosition += 8
      })
      
      // Add totals
      yPosition += 5
      doc.text(`Subtotal: ${orderDetails.subtotal.toFixed(2)} DA`, 20, yPosition)
      yPosition += 8
      doc.text(`Delivery Fee: ${orderDetails.deliveryFee.toFixed(2)} DA`, 20, yPosition)
      yPosition += 8
      doc.setFont('helvetica', 'bold')
      doc.text(`Total: ${orderDetails.total.toFixed(2)} DA`, 20, yPosition)
      
      // Generate QR code with actual phone number
      const phoneNumber = orderDetails.customerPhone
      const qrCodeDataURL = await QRCode.toDataURL(phoneNumber, {
        width: 50,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      // Add QR code to PDF
      doc.addImage(qrCodeDataURL, 'PNG', 150, 100, 30, 30)
      doc.setFontSize(8)
      doc.text('Scan for contact', 150, 135)
      
      // Add footer
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Thank you for your order!', 105, 250, { align: 'center' })
      doc.text('For support: +213 XXX XXX XXX', 105, 255, { align: 'center' })
      
      // Save the PDF
      doc.save(`receipt-${orderDetails.orderNumber}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your order. We&apos;ve received your order and will process it shortly.
            </p>

            {/* Order Details */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="font-medium">Order Number:</span>
                  <span className="font-bold text-primary">
                    {orderDetails?.orderNumber || searchParams.get('orderNumber') || 'ORD-123456'}
                  </span>
                </div>
                
                {orderDetails && (
                  <div className="text-left space-y-2 mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Customer:</span>
                      <span>{orderDetails.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phone:</span>
                      <span>{orderDetails.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold text-primary">{orderDetails.total.toFixed(2)} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Items:</span>
                      <span>{orderDetails.items.length} item(s)</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Estimated Delivery</h3>
                    <p className="text-sm text-muted-foreground">1-2 days</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Order Confirmation</h3>
                    <p className="text-sm text-muted-foreground">We&apos;ll call you soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What&apos;s Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Order Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        Our team will call you within 24 hours to confirm your order details.
                      </p>
                      <p className="text-xs text-red-600 mt-1 font-medium">
                        ⚠️ Important: If you don&apos;t answer our call within 48 hours, your order will be automatically canceled.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Order Processing</h4>
                      <p className="text-sm text-muted-foreground">
                        Once confirmed, we&apos;ll prepare your order for shipment.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Your order will be delivered to your specified address or pickup location within 1-2 days.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={generatePDFReceipt}
                disabled={isGeneratingPDF || !orderDetails}
                className="bg-green-600 hover:bg-green-700"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Receipt
                  </>
                )}
              </Button>
              
              <Button size="lg" asChild>
                <Link href={`/track-order`}>
                  <Package className="w-5 h-5 mr-2" />
                  Track Your Order
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-12 p-6 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm">+213 XXX XXX XXX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm">support@eshop-algeria.com</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}