import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .is('id_parent', null)
      .order('created_at', { ascending: false })

    const withReplies = await Promise.all(
      data!.map(async (c) => {
        const { data: replies } = await supabase
          .from('comments')
          .select('*')
          .eq('id_parent', c.id_comments)
        return { ...c, replies: replies || [] }
      })
    )

    return NextResponse.json(withReplies)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, message, id_parent, user_token } = await request.json()

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message required' },
        { status: 400 }
      )
    }

    const { data } = await supabase
      .from('comments')
      .insert([
        {
          name,
          message,
          id_parent: id_parent || null,
          user_token,
        },
      ])
      .select()

    return NextResponse.json(data![0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
