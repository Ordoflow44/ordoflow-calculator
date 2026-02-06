import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
  // Simple protection - check for setup key
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (key !== 'ordoflow-setup-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    // Check if tables exist by trying to count users
    try {
      await payload.count({ collection: 'users' })
      return NextResponse.json({
        success: true,
        message: 'Database already set up',
        status: 'ready'
      })
    } catch {
      // Tables don't exist, they should be created by push: true on first access
      // Let's try to create a test query to trigger schema sync
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful. Tables should be created automatically.',
      status: 'initialized'
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
