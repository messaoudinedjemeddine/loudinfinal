import { notFound } from 'next/navigation'
import ProductDetailClient from './product-detail-client'

interface Product {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  oldPrice?: number;
  category: {
    id: string;
    name: string;
    nameAr?: string;
    slug: string;
  } | string;
  categoryAr?: string;
  rating?: number;
  reviewCount?: number;
  isOnSale?: boolean;
  isLaunch?: boolean;
  isLaunchActive?: boolean;
  isOrderable?: boolean;
  launchAt?: string;
  stock: number;
  reference?: string;
  images: string[];
  sizes: Array<{ id: string; size: string; stock: number }>;
  features?: string[];
  specifications?: Record<string, string>;
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

// Required for static export
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/products`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return []
    }
    
    const data = await res.json()
    const products = Array.isArray(data) ? data : (data.products || [])
    
    return products.map((product: Product) => ({
      slug: product.slug,
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/products/slug/${slug}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.product
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}