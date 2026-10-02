import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await supabase.from('news').delete().eq('id_news', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const author = formData.get('author') as string

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Title, content, author required' },
        { status: 400 }
      )
    }

    const { data } = await supabase
      .from('news')
      .update({
        title,
        content,
        author,
        updated_at: new Date().toISOString(),
      })
      .eq('id_news', id)
      .select()

    return NextResponse.json(data![0])
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
