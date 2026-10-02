import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    const { data: images } = await supabase
      .from('about_images')
      .select('*')
      .order('created_at', { ascending: false })

    return NextResponse.json({ about: data, images })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const description = formData.get('description') as string
    const image = formData.get('image') as File

    if (!description) {
      return NextResponse.json(
        { error: 'Description required' },
        { status: 400 }
      )
    }

    const { data: about } = await supabase
      .from('about')
      .upsert(
        {
          id: 1,
          description,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()

    if (image) {
      const fileName = `${Date.now()}_${image.name}`
      await supabase.storage.from('about-images').upload(fileName, image)
      await supabase.from('about_images').insert([
        {
          image: fileName,
          id_about: about![0].id,
        },
      ])
    }

    return NextResponse.json(about![0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
