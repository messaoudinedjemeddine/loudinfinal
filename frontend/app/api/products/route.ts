import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const timestamp = Date.now()
    console.log(`[${timestamp}] Frontend API: Calling backend URL:`, `${backendUrl}/api/products`)
    
    const response = await fetch(`${backendUrl}/api/products?_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`[${timestamp}] Frontend API: Received from backend - products count:`, data.products?.length || 'N/A')
    console.log(`[${timestamp}] Frontend API: Pagination total:`, data.pagination?.total || 'N/A')
    console.log(`[${timestamp}] Frontend API: Product names:`, data.products?.map((p: any) => p.name) || [])
    
    const responseWithDebug = {
      ...data,
      debug: {
        timestamp,
        backendUrl,
        receivedCount: data.products?.length || 0,
        paginationTotal: data.pagination?.total || 0
      }
    }
    
    return NextResponse.json(responseWithDebug)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 