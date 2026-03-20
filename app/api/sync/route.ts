import { NextRequest, NextResponse } from 'next/server';
import { searchSamOpportunities, formatSamOpportunity } from '@/lib/sam-api';
import { searchUsaSpendingAwards, formatUsaSpendingAward } from '@/lib/usaspending-api';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { action, source } = await request.json();

    if (!action || !source) {
      return NextResponse.json(
        { error: 'Missing action or source parameter' },
        { status: 400 }
      );
    }

    if (action === 'sync-opportunities') {
      return await syncOpportunities();
    } else if (action === 'sync-awards') {
      return await syncAwards();
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

async function syncOpportunities() {
  const startTime = new Date();
  let recordsProcessed = 0;
  let errorMessage = null;

  try {
    // Log sync start
    await supabase.from('sync_logs').insert({
      source: 'sam.gov',
      status: 'in_progress',
      started_at: startTime.toISOString(),
    });

    // Fetch from SAM API
    const results = await searchSamOpportunities({
      limit: 100,
    });

    // Format and upsert to database
    const opportunities = results.opportunities.map(formatSamOpportunity);

    const { data, error } = await supabase
      .from('opportunities')
      .upsert(opportunities, { onConflict: 'sam_notice_id' })
      .select();

    if (error) throw error;

    recordsProcessed = opportunities.length;

    // Log successful sync
    await supabase.from('sync_logs').insert({
      source: 'sam.gov',
      status: 'completed',
      records_processed: recordsProcessed,
      started_at: startTime.toISOString(),
      completed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      status: 'success',
      source: 'sam.gov',
      recordsProcessed,
      duration: new Date().getTime() - startTime.getTime(),
    });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log failed sync
    await supabase.from('sync_logs').insert({
      source: 'sam.gov',
      status: 'failed',
      records_processed: recordsProcessed,
      error_message: errorMessage,
      started_at: startTime.toISOString(),
      completed_at: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        status: 'error',
        source: 'sam.gov',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

async function syncAwards() {
  const startTime = new Date();
  let recordsProcessed = 0;
  let errorMessage = null;

  try {
    // Log sync start
    await supabase.from('sync_logs').insert({
      source: 'usaspending.gov',
      status: 'in_progress',
      started_at: startTime.toISOString(),
    });

    // Fetch from USAspending API
    const results = await searchUsaSpendingAwards({
      limit: 100,
    });

    // Format and upsert to database
    const awards = results.awards.map(formatUsaSpendingAward);

    const { data, error } = await supabase
      .from('contract_awards')
      .upsert(awards, { onConflict: 'award_id' })
      .select();

    if (error) throw error;

    recordsProcessed = awards.length;

    // Log successful sync
    await supabase.from('sync_logs').insert({
      source: 'usaspending.gov',
      status: 'completed',
      records_processed: recordsProcessed,
      started_at: startTime.toISOString(),
      completed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      status: 'success',
      source: 'usaspending.gov',
      recordsProcessed,
      duration: new Date().getTime() - startTime.getTime(),
    });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log failed sync
    await supabase.from('sync_logs').insert({
      source: 'usaspending.gov',
      status: 'failed',
      records_processed: recordsProcessed,
      error_message: errorMessage,
      started_at: startTime.toISOString(),
      completed_at: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        status: 'error',
        source: 'usaspending.gov',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
