import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable caching to always get fresh data
    })

    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`)
      // Return empty array instead of throwing error
      return NextResponse.json([])
    }

    const data = await response.json()
    // Backend returns { categories: [...] }, but frontend expects just the array
    // Ensure we always return an array
    const categories = Array.isArray(data.categories) ? data.categories : 
                      Array.isArray(data) ? data : []
    
    const result = NextResponse.json(categories)
    
    // Add cache control headers to prevent caching
    result.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    result.headers.set('Pragma', 'no-cache')
    result.headers.set('Expires', '0')
    
    return result
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Return empty array instead of error response
    return NextResponse.json([])
  }
} 