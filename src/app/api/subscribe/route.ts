import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { error } = await supabase
      .from('subscribers')
      .insert({ email: email.toLowerCase().trim() })

    // If email already exists, treat it as success (not an error)
    if (error && error.code === '23505') {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
    }

    if (error) throw error

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
