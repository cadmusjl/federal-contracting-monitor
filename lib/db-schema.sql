-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sam_notice_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  agency TEXT NOT NULL,
  classification_code TEXT,
  set_aside_type TEXT,
  contract_status TEXT,
  opportunity_type TEXT,
  posting_date TIMESTAMP WITH TIME ZONE,
  closing_date TIMESTAMP WITH TIME ZONE,
  deadline_date TIMESTAMP WITH TIME ZONE,
  estimated_amount DECIMAL(15,2),
  small_business_eligible BOOLEAN,
  woman_owned BOOLEAN,
  veteran_owned BOOLEAN,
  service_disabled_veteran_owned BOOLEAN,
  minority_owned BOOLEAN,
  naics_codes TEXT[],
  contact_email TEXT,
  contact_name TEXT,
  sam_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contract awards table
CREATE TABLE IF NOT EXISTS contract_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  award_id TEXT UNIQUE NOT NULL,
  contract_number TEXT,
  agency TEXT NOT NULL,
  contractor_name TEXT NOT NULL,
  contract_value DECIMAL(15,2),
  obligated_amount DECIMAL(15,2),
  award_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  classification_code TEXT,
  recipient_duns TEXT,
  recipient_cage TEXT,
  performance_period_start TIMESTAMP WITH TIME ZONE,
  performance_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved filters table
CREATE TABLE IF NOT EXISTS saved_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  filter_config JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create opportunity tracking table
CREATE TABLE IF NOT EXISTS tracked_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'watching',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- Create data sync log table
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  records_processed INTEGER,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_agency ON opportunities(agency);
CREATE INDEX IF NOT EXISTS idx_opportunities_set_aside ON opportunities(set_aside_type);
CREATE INDEX IF NOT EXISTS idx_opportunities_closing_date ON opportunities(closing_date);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(contract_status);
CREATE INDEX IF NOT EXISTS idx_opportunities_opportunity_type ON opportunities(opportunity_type);
CREATE INDEX IF NOT EXISTS idx_opportunities_estimated_amount ON opportunities(estimated_amount);

CREATE INDEX IF NOT EXISTS idx_contract_awards_agency ON contract_awards(agency);
CREATE INDEX IF NOT EXISTS idx_contract_awards_contractor ON contract_awards(contractor_name);
CREATE INDEX IF NOT EXISTS idx_contract_awards_award_date ON contract_awards(award_date);

CREATE INDEX IF NOT EXISTS idx_tracked_opportunities_user ON tracked_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_opportunities_status ON tracked_opportunities(status);

CREATE INDEX IF NOT EXISTS idx_sync_logs_source ON sync_logs(source);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created ON sync_logs(created_at);

-- Create views for common queries
CREATE OR REPLACE VIEW opportunities_by_agency AS
SELECT 
  agency,
  COUNT(*) as count,
  SUM(estimated_amount) as total_value,
  AVG(estimated_amount) as avg_value
FROM opportunities
WHERE closing_date > NOW()
GROUP BY agency
ORDER BY count DESC;

CREATE OR REPLACE VIEW contract_spend_by_agency AS
SELECT 
  agency,
  COUNT(*) as award_count,
  SUM(contract_value) as total_obligated,
  AVG(contract_value) as avg_award
FROM contract_awards
GROUP BY agency
ORDER BY total_obligated DESC;
