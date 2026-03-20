import { NextRequest, NextResponse } from 'next/server';
import { searchSamOpportunities, formatSamOpportunity } from '@/lib/sam-api';
import { getOpportunities } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'db';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');

    if (source === 'sam') {
      const results = await searchSamOpportunities({
        keyword: searchParams.get('keyword') || undefined,
        agency: searchParams.get('agency') || undefined,
        set_aside: searchParams.get('set_aside') || undefined,
        deadline_from: searchParams.get('deadline_from') || undefined,
        deadline_to: searchParams.get('deadline_to') || undefined,
        est_amount_from: searchParams.get('est_amount_from')
          ? parseInt(searchParams.get('est_amount_from')!)
          : undefined,
        est_amount_to: searchParams.get('est_amount_to')
          ? parseInt(searchParams.get('est_amount_to')!)
          : undefined,
        page,
        limit,
      });

      return NextResponse.json(results);
    }

    // Default: fetch from local database
    const filters: Record<string, any> = {};

    if (searchParams.get('agency')) filters.agency = searchParams.get('agency');
    if (searchParams.get('set_aside_type')) filters.set_aside_type = searchParams.get('set_aside_type');
    if (searchParams.get('contract_status')) filters.contract_status = searchParams.get('contract_status');
    if (searchParams.get('opportunity_type')) filters.opportunity_type = searchParams.get('opportunity_type');
    if (searchParams.get('min_amount')) filters.min_amount = parseInt(searchParams.get('min_amount')!);
    if (searchParams.get('max_amount')) filters.max_amount = parseInt(searchParams.get('max_amount')!);
    if (searchParams.get('closing_date_from')) filters.closing_date_from = searchParams.get('closing_date_from');
    if (searchParams.get('closing_date_to')) filters.closing_date_to = searchParams.get('closing_date_to');
    if (searchParams.get('search_query')) filters.search_query = searchParams.get('search_query');

    const result = await getOpportunities(Object.keys(filters).length > 0 ? filters : undefined, limit, page);

    return NextResponse.json({
      opportunities: result.data,
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
    const { opportunity, save_to_db } = body;

    if (!opportunity) {
      return NextResponse.json({ error: 'Missing opportunity data' }, { status: 400 });
    }

    if (save_to_db) {
      const { supabase } = await import('@/lib/supabase');
      const formatted = formatSamOpportunity(opportunity);

      const { data, error } = await supabase
        .from('opportunities')
        .upsert([formatted], { onConflict: 'sam_notice_id' })
        .select();

      if (error) throw error;
      return NextResponse.json({ saved: data });
    }

    return NextResponse.json({ formatted: formatSamOpportunity(opportunity) });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
