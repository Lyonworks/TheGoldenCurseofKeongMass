import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data } = await supabase
      .from('merchandise')
      .select('*')
      .order('created_at', { ascending: false })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseInt(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string) || 0
    const limited = formData.get('limited') ? 1 : 0
    const image = formData.get('image') as File

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price required' },
        { status: 400 }
      )
    }

    let imagePath = null
    if (image) {
      imagePath = `${Date.now()}_${image.name}`
      await supabase.storage
        .from('merchandise-images')
        .upload(imagePath, image)
    }

    const { data } = await supabase
      .from('merchandise')
      .insert([
        {
          name,
          description,
          price,
          stock,
          limited,
          image: imagePath,
        },
      ])
      .select()

    return NextResponse.json(data![0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
