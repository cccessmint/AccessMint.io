// src/app/api/fetch-ticket-types/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('ticket_types')
    .select('*');

  if (error) {
    console.error('❌ Supabase fetch error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch ticket types' }, { status: 500 });
  }

  return NextResponse.json(data);
}

