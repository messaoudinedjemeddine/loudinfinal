'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Trash2,
  Share2,
  Eye
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCartStore } from '@/lib/store'
import { toast } from 'sonner'

// Mock wishlist data
const mockWishlistItems = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 8500,
    oldPrice: 12000,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.8,
    isOnSale: true,
    inStock: true,
    addedDate: '2024-01-10'
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    price: 15000,
    oldPrice: null,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.9,
    isOnSale: false,
    inStock: true,
    addedDate: '2024-01-08'
  },
  {
    id: '3',
    name: 'Designer Handbag',
    price: 6500,
    oldPrice: 9000,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.7,
    isOnSale: true,
    inStock: false,
    addedDate: '2024-01-05'
  },
  {
    id: '4',
    name: 'Gaming Keyboard',
    price: 4500,
    oldPrice: null,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.6,
    isOnSale: false,
    inStock: true,
    addedDate: '2024-01-03'
  }
]

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false)
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleAddToCart = (product: any) => {
    if (!product.inStock) {
      toast.error('This item is currently out of stock')
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
    toast.success('Added to cart!')
  }

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId))
    toast.success('Removed from wishlist')
  }

  const handleAddAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock)
    
    if (inStockItems.length === 0) {
      toast.error('No items in stock to add to cart')
      return
    }

    inStockItems.forEach(item => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      })
    })

    toast.success(`Added ${inStockItems.length} items to cart!`)
  }

  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Wishlist link copied to clipboard!')
  }

  const WishlistItem = ({ item, index }: { item: any, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {item.isOnSale && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                Sale
              </Badge>
            )}
            {!item.inStock && (
              <Badge className="absolute top-2 right-2 bg-gray-500">
                Out of Stock
              </Badge>
            )}
            
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0"
                onClick={() => handleRemoveFromWishlist(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0"
                asChild
              >
                <Link href={`/products/${item.id}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(item.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  ({item.rating})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary">
                  {item.price.toLocaleString()} DA
                </span>
                {item.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {item.oldPrice.toLocaleString()} DA
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                className="flex-1"
                onClick={() => handleAddToCart(item)}
                disabled={!item.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveFromWishlist(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              Added on {new Date(item.addedDate).toLocaleDateString()}
            </p>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
                <Heart className="w-12 h-12 mr-4 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Keep track of items you love and want to purchase later
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {wishlistItems.length === 0 ? (
            /* Empty Wishlist */
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start adding items to your wishlist by clicking the heart icon on products you love
              </p>
              <Button size="lg" asChild>
                <Link href="/products">
                  Start Shopping
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Wishlist Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
                  </h2>
                  <p className="text-muted-foreground">
                    {wishlistItems.filter(item => item.inStock).length} in stock
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleShareWishlist}
                    className="flex items-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Wishlist
                  </Button>
                  <Button
                    onClick={handleAddAllToCart}
                    className="flex items-center"
                    disabled={wishlistItems.filter(item => item.inStock).length === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item, index) => (
                  <WishlistItem key={item.id} item={item} index={index} />
                ))}
              </div>

              {/* Recommendations */}
              <section className="mt-16 pt-16 border-t">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl font-bold mb-4">You Might Also Like</h2>
                  <p className="text-muted-foreground">
                    Based on items in your wishlist
                  </p>
                </motion.div>

                <div className="text-center">
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/products">
                      Explore More Products
                    </Link>
                  </Button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}