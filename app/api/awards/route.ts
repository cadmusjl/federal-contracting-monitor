import { NextRequest, NextResponse } from 'next/server';
import { searchUsaSpendingAwards, formatUsaSpendingAward } from '@/lib/usaspending-api';
import { getContractAwards } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'db';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');

    if (source === 'usaspending') {
      const agencies = searchParams.get('agencies')
        ? searchParams.get('agencies')!.split(',')
        : undefined;

      const results = await searchUsaSpendingAwards({
        agencies,
        keyword: searchParams.get('keyword') || undefined,
        award_amount_min: searchParams.get('award_amount_min')
          ? parseInt(searchParams.get('award_amount_min')!)
          : undefined,
        award_amount_max: searchParams.get('award_amount_max')
          ? parseInt(searchParams.get('award_amount_max')!)
          : undefined,
        date_from: searchParams.get('date_from') || undefined,
        date_to: searchParams.get('date_to') || undefined,
        page,
        limit,
      });

      return NextResponse.json(results);
    }

    // Default: fetch from local database
    const filters: Record<string, any> = {};

    if (searchParams.get('agency')) filters.agency = searchParams.get('agency');
    if (searchParams.get('min_amount')) filters.min_amount = parseInt(searchParams.get('min_amount')!);
    if (searchParams.get('max_amount')) filters.max_amount = parseInt(searchParams.get('max_amount')!);
    if (searchParams.get('date_from')) filters.date_from = searchParams.get('date_from');
    if (searchParams.get('date_to')) filters.date_to = searchParams.get('date_to');
    if (searchParams.get('search_query')) filters.search_query = searchParams.get('search_query');

    const result = await getContractAwards(Object.keys(filters).length > 0 ? filters : undefined, limit, page);

    return NextResponse.json({
      awards: result.data,
      total: result.count,
      page: result.page,
      limit: result.limit,
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
    const { award, save_to_db } = body;

    if (!award) {
      return NextResponse.json({ error: 'Missing award data' }, { status: 400 });
    }

    if (save_to_db) {
      const { supabase } = await import('@/lib/supabase');
      const formatted = formatUsaSpendingAward(award);

      const { data, error } = await supabase
        .from('contract_awards')
        .upsert([formatted], { onConflict: 'award_id' })
        .select();

      if (error) throw error;
      return NextResponse.json({ saved: data });
    }

    return NextResponse.json({ formatted: formatUsaSpendingAward(award) });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
