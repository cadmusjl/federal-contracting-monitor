import axios from 'axios';

const USASPENDING_BASE_URL = 'https://api.usaspending.gov/api/v2';

interface UsaSpendingAward {
  id: number;
  award_id: string;
  piid: string;
  recipient_name: string;
  award_amount: number;
  obligated_amount: number;
  action_date: string;
  description: string;
  awarding_agency_name: string;
  recipient_duns: string;
  recipient_uei: string;
  product_or_service_code: string;
  start_date: string;
  end_date: string;
  contract_type: string;
}

interface UsaSpendingSearchParams {
  agencies?: string[];
  keyword?: string;
  award_amount_min?: number;
  award_amount_max?: number;
  date_from?: string;
  date_to?: string;
  award_types?: string[];
  page?: number;
  limit?: number;
}

export async function searchUsaSpendingAwards(params: UsaSpendingSearchParams) {
  try {
    const filters: Record<string, any> = {
      award_type_codes: params.award_types || ['A', 'B', 'C', 'D'],
    };

    if (params.agencies && params.agencies.length > 0) {
      filters.agencies = params.agencies.map(a => ({ name: a }));
    }

    if (params.keyword) {
      filters.keywords = [params.keyword];
    }

    if (params.award_amount_min || params.award_amount_max) {
      filters.award_amounts = [];
      if (params.award_amount_min) {
        filters.award_amounts.push({ amount_min: params.award_amount_min });
      }
      if (params.award_amount_max) {
        filters.award_amounts.push({ amount_max: params.award_amount_max });
      }
    }

    if (params.date_from || params.date_to) {
      filters.time_period = [];
      if (params.date_from) {
        filters.time_period.push({ start_date: params.date_from });
      }
      if (params.date_to) {
        filters.time_period.push({ end_date: params.date_to });
      }
    }

    const payload = {
      filters,
      page: params.page || 1,
      limit: Math.min(params.limit || 25, 100),
      sort: '-action_date',
    };

    const response = await axios.post(
      `${USASPENDING_BASE_URL}/awards/search/`,
      payload,
      { timeout: 30000 }
    );

    return {
      awards: response.data.results || [],
      total: response.data.page_metadata?.total_rows || 0,
      page: params.page || 1,
    };
  } catch (error) {
    console.error('USAspending API error:', error);
    throw new Error(
      `Failed to fetch USAspending awards: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getUsaSpendingRecipient(uei: string) {
  try {
    const response = await axios.get(
      `${USASPENDING_BASE_URL}/recipient/duns/${uei}/`,
      { timeout: 30000 }
    );
    return response.data || null;
  } catch (error) {
    console.error('USAspending recipient lookup error:', error);
    return null;
  }
}

export async function getAgencySpending(agency_id: string, fiscal_year?: number) {
  try {
    const params: Record<string, any> = {
      agency_id,
    };

    if (fiscal_year) {
      params.fiscal_year = fiscal_year;
    }

    const response = await axios.get(`${USASPENDING_BASE_URL}/agency/${agency_id}/`, {
      params,
      timeout: 30000,
    });

    return response.data || null;
  } catch (error) {
    console.error('USAspending agency spending error:', error);
    return null;
  }
}

export function formatUsaSpendingAward(award: UsaSpendingAward) {
  return {
    award_id: award.award_id,
    contract_number: award.piid,
    agency: award.awarding_agency_name,
    contractor_name: award.recipient_name,
    contract_value: award.award_amount,
    obligated_amount: award.obligated_amount,
    award_date: award.action_date ? new Date(award.action_date) : null,
    description: award.description,
    classification_code: award.product_or_service_code,
    recipient_duns: award.recipient_duns,
    recipient_cage: award.recipient_uei,
    performance_period_start: award.start_date ? new Date(award.start_date) : null,
    performance_period_end: award.end_date ? new Date(award.end_date) : null,
  };
}
