import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${backendUrl}/api/admin/products/${params.id}`, {
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching admin product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const token = request.headers.get('authorization')
    const body = await request.json()
    
    const response = await fetch(`${backendUrl}/api/admin/products/${params.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    if (!response.ok) {
      throw new Error('Failed to update product')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${backendUrl}/api/admin/products/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete product')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
} 