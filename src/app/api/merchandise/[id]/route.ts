import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await supabase.from('merchandise').delete().eq('id', id)
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
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseInt(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string) || 0
    const limited = formData.get('limited') ? 1 : 0

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price required' },
        { status: 400 }
      )
    }

    const { data } = await supabase
      .from('merchandise')
      .update({
        name,
        description,
        price,
        stock,
        limited,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    return NextResponse.json(data![0])
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
