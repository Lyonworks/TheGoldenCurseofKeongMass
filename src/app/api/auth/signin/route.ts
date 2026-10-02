import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')

    if (data.password !== hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = crypto.randomBytes(32).toString('hex')
    const response = NextResponse.json({
      success: true,
      token,
      username: data.username,
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
