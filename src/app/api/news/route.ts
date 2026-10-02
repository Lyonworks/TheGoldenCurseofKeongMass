import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const author = formData.get('author') as string
    const image = formData.get('image') as File

    if (!title || !content || !author || !image) {
      return NextResponse.json(
        { error: 'All fields required' },
        { status: 400 }
      )
    }

    const fileName = `${Date.now()}_${image.name}`
    await supabase.storage.from('news-images').upload(fileName, image)

    const { data } = await supabase
      .from('news')
      .insert([{ title, content, author, image: fileName }])
      .select()

    return NextResponse.json(data![0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
