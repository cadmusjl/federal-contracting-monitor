# Federal Contracting Monitor - Vercel Deployment Guide

## Status
Repository pushed to GitHub: https://github.com/cadmusjl/federal-contracting-monitor

## Pre-Deployment Checklist

### Backend Setup (COMPLETE)
- [x] Supabase project: orchids-innovix-iop (scvvadyftbrgzpwngfff)
- [x] Database tables created: fcm_opportunities, fcm_contract_awards, fcm_saved_filters, fcm_tracked_opportunities, fcm_sync_logs
- [x] Database views created: fcm_opportunities_by_agency, fcm_contract_spend_by_agency
- [x] Database indexes created for optimal query performance

### GitHub Setup (COMPLETE)
- [x] Repository: cadmusjl/federal-contracting-monitor
- [x] Main branch with all source code
- [x] vercel.json configuration added
- [x] .env.example configured

## Next Steps: Vercel Deployment

### Method 1: Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "Add New..." > "Project"
3. Select "Import Git Repository"
4. Search for "federal-contracting-monitor"
5. Click "Import"
6. Configure project:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
7. Click "Deploy"

### Method 2: CLI (Alternative)
```bash
cd /root/.openclaw/workspace/Workspace/Projects/FederalContractingMonitor
vercel --prod --confirm
```

## Environment Variables to Configure in Vercel

After deployment, add these environment variables in Vercel Project Settings:

```
NEXT_PUBLIC_SUPABASE_URL = https://scvvadyftbrgzpwngfff.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = <your-supabase-anon-key>
NEXT_PUBLIC_SAM_API_KEY = SAM-e7836b2d-f088-433c-8a8c-2c28848e260b
NEXT_PUBLIC_USASPENDING_API_BASE = https://api.usaspending.gov/api/v2
NODE_ENV = production
```

### Getting Supabase Anon Key
```bash
mcporter call supabase.execute_sql project_id=scvvadyftbrgzpwngfff query="SELECT decrypted_secret FROM pgsodium.decrypted_secrets WHERE name = 'anon_key';" 2>&1
```

Or from Supabase Dashboard:
1. Go to https://app.supabase.com
2. Select orchids-innovix-iop project
3. Settings > API > anon (public) key

## Custom Domain Configuration

After Vercel deployment is live:

1. In Vercel Project Settings > Domains
2. Add "federal-monitor.innovixdynamix.com"
3. Vercel will show DNS records to add
4. Update innovixdynamix.com DNS records with:
   - CNAME: cname.vercel-dns.com

Wait 24-48 hours for DNS propagation.

## Smoke Tests

After deployment and domain configuration:

### 1. Check Application Load
```bash
curl -I https://federal-monitor.innovixdynamix.com
```

### 2. Verify SAM.gov API Connection
Test endpoint: GET /api/opportunities?agency=DoD&limit=10
Expected: 200 OK with opportunities JSON

### 3. Verify USAspending.gov API Connection
Test endpoint: GET /api/awards?agency=DoD&limit=10
Expected: 200 OK with awards JSON

### 4. Verify Database Connection
Check Supabase logs for successful query executions

## Deployment Status

- GitHub Repository: ✅ COMPLETE
- Database Schema: ✅ COMPLETE
- Vercel Project Setup: ⏳ PENDING (requires Vercel token/dashboard access)
- Environment Variables: ⏳ PENDING (post-Vercel creation)
- Custom Domain: ⏳ PENDING (post-Vercel deployment)
- Smoke Tests: ⏳ PENDING (post-deployment)

## Notes

- vercel.json configuration is committed to the repository
- All API keys are configured as environment variables (not hardcoded)
- Next.js 15.5.14 with TypeScript and Tailwind CSS
- Production build optimizations enabled
- Regions: US East (iad1)

---

**Next Action**: Deploy via Vercel Dashboard or CLI with VERCEL_TOKEN authentication
