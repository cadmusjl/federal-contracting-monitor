import { NextRequest, NextResponse } from 'next/server';
import { saveFilter, getSavedFilters } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id parameter' }, { status: 400 });
    }

    const filters = await getSavedFilters(userId);

    return NextResponse.json({
      filters,
      count: filters.length,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, name, filter_config } = body;

    if (!user_id || !name || !filter_config) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, name, filter_config' },
        { status: 400 }
      );
    }

    const result = await saveFilter(user_id, name, filter_config);

    return NextResponse.json({
      status: 'saved',
      filter: result,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
