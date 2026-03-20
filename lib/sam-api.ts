import axios from 'axios';

const SAM_BASE_URL = 'https://api.sam.gov/opportunities/v1/search';
const SAM_API_KEY = process.env.NEXT_PUBLIC_SAM_API_KEY || '';

interface SamOpportunity {
  notice_id: string;
  title: string;
  description: string;
  agency: string;
  classcod: string;
  set_aside_type: string;
  notice_type: string;
  posting_date: string;
  deadline_date: string;
  deadline_notice: string;
  est_project_start: string;
  estamt: number;
  officeaddress: string;
  email: string;
  contact: string;
  link: string;
  naics_codes?: string[];
  small_business_eligible?: boolean;
  woman_owned?: boolean;
  veteran_owned?: boolean;
  service_disabled_veteran_owned?: boolean;
  minority_owned?: boolean;
}

interface SamSearchParams {
  keyword?: string;
  agency?: string;
  set_aside?: string;
  notice_type?: string;
  posted_from?: string;
  posted_to?: string;
  deadline_from?: string;
  deadline_to?: string;
  est_amount_from?: number;
  est_amount_to?: number;
  page?: number;
  limit?: number;
}

export async function searchSamOpportunities(params: SamSearchParams) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.agency) queryParams.append('agency', params.agency);
    if (params.set_aside) queryParams.append('set_aside', params.set_aside);
    if (params.notice_type) queryParams.append('notice_type', params.notice_type);
    if (params.posted_from) queryParams.append('posted_from', params.posted_from);
    if (params.posted_to) queryParams.append('posted_to', params.posted_to);
    if (params.deadline_from) queryParams.append('deadline_from', params.deadline_from);
    if (params.deadline_to) queryParams.append('deadline_to', params.deadline_to);
    if (params.est_amount_from) queryParams.append('est_amount_from', params.est_amount_from.toString());
    if (params.est_amount_to) queryParams.append('est_amount_to', params.est_amount_to.toString());
    
    queryParams.append('api_key', SAM_API_KEY);
    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('limit', Math.min(params.limit || 25, 100).toString());

    const response = await axios.get(`${SAM_BASE_URL}?${queryParams.toString()}`, {
      timeout: 30000,
    });

    return {
      opportunities: response.data.opportunitiesdata || [],
      total: response.data.total || 0,
      page: params.page || 1,
    };
  } catch (error) {
    console.error('SAM API error:', error);
    throw new Error(`Failed to fetch SAM opportunities: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getSamEntity(uei: string) {
  try {
    const response = await axios.get(
      `https://api.sam.gov/entity-information/v2/entities?uei=${uei}&api_key=${SAM_API_KEY}`,
      { timeout: 30000 }
    );
    return response.data.entityData?.[0] || null;
  } catch (error) {
    console.error('SAM entity lookup error:', error);
    return null;
  }
}

export function formatSamOpportunity(opp: SamOpportunity) {
  return {
    sam_notice_id: opp.notice_id,
    title: opp.title,
    description: opp.description,
    agency: opp.agency,
    classification_code: opp.classcod,
    set_aside_type: opp.set_aside_type,
    opportunity_type: opp.notice_type,
    posting_date: opp.posting_date ? new Date(opp.posting_date) : null,
    closing_date: opp.deadline_date ? new Date(opp.deadline_date) : null,
    estimated_amount: opp.estamt || null,
    small_business_eligible: opp.small_business_eligible ?? false,
    woman_owned: opp.woman_owned ?? false,
    veteran_owned: opp.veteran_owned ?? false,
    service_disabled_veteran_owned: opp.service_disabled_veteran_owned ?? false,
    minority_owned: opp.minority_owned ?? false,
    naics_codes: opp.naics_codes || [],
    contact_email: opp.email,
    contact_name: opp.contact,
    sam_url: opp.link,
  };
}
