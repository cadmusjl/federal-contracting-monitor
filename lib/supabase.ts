import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create client, warn if credentials are missing
let supabase: any = null;

try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn('Supabase credentials are missing. Features requiring database access will not work.');
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client:', error);
}

export { supabase };

export async function getOpportunities(filters?: Record<string, any>, limit = 25, page = 1) {
  try {
    let query = supabase
      .from('opportunities')
      .select('*', { count: 'exact' });

    if (filters) {
      if (filters.agency) {
        query = query.eq('agency', filters.agency);
      }
      if (filters.set_aside_type) {
        query = query.eq('set_aside_type', filters.set_aside_type);
      }
      if (filters.contract_status) {
        query = query.eq('contract_status', filters.contract_status);
      }
      if (filters.opportunity_type) {
        query = query.eq('opportunity_type', filters.opportunity_type);
      }
      if (filters.min_amount) {
        query = query.gte('estimated_amount', filters.min_amount);
      }
      if (filters.max_amount) {
        query = query.lte('estimated_amount', filters.max_amount);
      }
      if (filters.closing_date_from) {
        query = query.gte('closing_date', filters.closing_date_from);
      }
      if (filters.closing_date_to) {
        query = query.lte('closing_date', filters.closing_date_to);
      }
      if (filters.search_query) {
        query = query.or(
          `title.ilike.%${filters.search_query}%,description.ilike.%${filters.search_query}%`
        );
      }
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .order('closing_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    throw error;
  }
}

export async function getContractAwards(filters?: Record<string, any>, limit = 25, page = 1) {
  try {
    let query = supabase
      .from('contract_awards')
      .select('*', { count: 'exact' });

    if (filters) {
      if (filters.agency) {
        query = query.eq('agency', filters.agency);
      }
      if (filters.min_amount) {
        query = query.gte('contract_value', filters.min_amount);
      }
      if (filters.max_amount) {
        query = query.lte('contract_value', filters.max_amount);
      }
      if (filters.date_from) {
        query = query.gte('award_date', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('award_date', filters.date_to);
      }
      if (filters.search_query) {
        query = query.or(
          `contractor_name.ilike.%${filters.search_query}%,description.ilike.%${filters.search_query}%`
        );
      }
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .order('award_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error('Error fetching contract awards:', error);
    throw error;
  }
}

export async function saveOpportunity(userId: string, opportunityId: string, notes?: string) {
  try {
    const { data, error } = await supabase
      .from('tracked_opportunities')
      .upsert(
        {
          user_id: userId,
          opportunity_id: opportunityId,
          notes,
          status: 'watching',
        },
        { onConflict: 'user_id,opportunity_id' }
      )
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving opportunity:', error);
    throw error;
  }
}

export async function getSavedOpportunities(userId: string) {
  try {
    const { data, error } = await supabase
      .from('tracked_opportunities')
      .select('opportunities(*), status, notes, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching saved opportunities:', error);
    throw error;
  }
}

export async function saveFilter(userId: string, name: string, filterConfig: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('saved_filters')
      .upsert(
        {
          user_id: userId,
          name,
          filter_config: filterConfig,
        },
        { onConflict: 'user_id,name' }
      )
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving filter:', error);
    throw error;
  }
}

export async function getSavedFilters(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_filters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching saved filters:', error);
    throw error;
  }
}
