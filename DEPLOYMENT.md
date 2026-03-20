# Deployment Guide

## Vercel Deployment Steps

### 1. Prepare GitHub Repository

```bash
cd /path/to/federal-contracting-monitor
git init
git add .
git commit -m "Initial federal-contracting-monitor commit"
git branch -M main
git remote add origin https://github.com/cadmusjl/federal-contracting-monitor.git
git push -u origin main
```

### 2. Set Up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Copy project URL and anon key
3. Go to SQL Editor
4. Run schema from `lib/db-schema.sql`
5. Enable Row Level Security (RLS) for production
6. Create service role if needed for backend syncs

### 3. Configure SAM.gov API Access

1. Go to [sam.gov](https://sam.gov)
2. Create account and request API key
3. Store key securely (will use in Vercel)

### 4. Deploy to Vercel

#### Option A: Via GitHub Integration (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Continue with GitHub"
3. Authenticate and authorize Vercel
4. Select `federal-contracting-monitor` repository
5. Configure project:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_SAM_API_KEY=your_sam_api_key
   ```
7. Click Deploy
8. Monitor build logs
9. Verify deployment at Vercel domain

#### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 5. Post-Deployment Configuration

#### Custom Domain
1. In Vercel project settings
2. Go to Domains
3. Add custom domain
4. Update DNS records with Vercel-provided values
5. Wait for SSL certificate (automatic, ~5 minutes)

#### Environment Variables
In Vercel dashboard:
1. Project Settings > Environment Variables
2. Add all required variables
3. Select environments (Production, Preview, Development)
4. Redeploy if needed

#### Analytics & Monitoring
1. Enable Vercel Analytics (optional)
2. Monitor performance in Vercel dashboard
3. Set up alerts for errors

### 6. Data Synchronization Setup

Option A: Manual Sync
- Call `/api/sync` endpoint manually when needed
- Use curl or browser for testing

Option B: Automated Sync (Recommended)
- Use Vercel Cron Functions (Pro plan required)
- Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Option C: External Scheduler
- Use GitHub Actions, Cloud Scheduler, or similar
- Call webhook regularly
- Configure secret header for authentication

### 7. Verify Deployment

Test the live application:

```bash
# Test opportunities endpoint
curl "https://your-domain.com/api/opportunities?limit=5"

# Test awards endpoint
curl "https://your-domain.com/api/awards?limit=5"

# Test sync endpoint (production only)
curl -X POST https://your-domain.com/api/sync \
  -H "Content-Type: application/json" \
  -d '{"action":"sync-opportunities","source":"sam.gov"}'
```

## Troubleshooting

### Build Failures

**Issue:** Build fails with `Module not found`
- **Solution:** Run `npm install` locally to verify dependencies
- Check `package.json` for missing entries
- Clear npm cache: `npm cache clean --force`

**Issue:** TypeScript errors in build
- **Solution:** Run `npm run type-check` locally
- Fix any type errors before deploying
- Ensure all imports are correct

### Runtime Errors

**Issue:** Supabase connection fails
- **Solution:** Verify environment variables are set correctly
- Check Supabase project is active
- Verify network connectivity in Vercel function logs

**Issue:** SAM.gov API errors
- **Solution:** Verify API key is valid
- Check API rate limits (SAM.gov has limits)
- Review API response in browser console

**Issue:** Database query timeout
- **Solution:** Optimize indexes on filtered columns
- Add pagination to large queries
- Consider query caching

### Performance Issues

**Issue:** Slow page loads
- **Solution:** Enable Vercel Edge Caching
- Implement API response caching
- Optimize database indexes
- Consider CDN for static assets

**Issue:** High database query load
- **Solution:** Implement query result caching
- Use pagination for large result sets
- Archive old data regularly
- Monitor `sync_logs` for failed syncs

## Monitoring & Maintenance

### Daily Checks
- Monitor Vercel deployment health
- Check for API errors in browser console
- Verify data sync runs successfully

### Weekly Checks
- Review sync logs in database
- Monitor Supabase usage metrics
- Check API key rate limit usage
- Review error logs

### Monthly Checks
- Analyze performance metrics
- Update dependencies: `npm update`
- Review and optimize database indexes
- Plan data retention/archival policy

## Security Checklist

- [ ] Environment variables stored in Vercel (not in code)
- [ ] API keys rotated regularly
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] No sensitive data in git history
- [ ] Vercel branch protection configured
- [ ] Database backups enabled (Supabase)
- [ ] Rate limiting enabled on endpoints
- [ ] CORS configured appropriately

## Cost Estimation

### Supabase (Free Tier)
- Project: Free
- Database: 500MB storage
- Real-time: Included
- API requests: 100k/month

### Vercel (Free Tier)
- Deployments: Unlimited
- Bandwidth: 100GB/month
- Functions: 1M invocations/month
- Serverless Functions: 12 seconds timeout

### Estimated Production Costs
- Supabase Pro: $25/month (1GB storage, unlimited API)
- Vercel Pro: $20/month (for priority support)
- Total: ~$45/month for full production setup

## Rollback Procedure

### Rollback to Previous Deployment

1. In Vercel dashboard
2. Go to Deployments
3. Find previous stable deployment
4. Click the deployment
5. Click "Rollback to this Deployment"
6. Confirm action
7. Wait for rollback to complete

### Rollback via Git

```bash
git revert HEAD
git push origin main
```

## Updates & Maintenance

### Update Dependencies
```bash
npm update
npm install --save-latest
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Deploy Updates
1. Commit changes to main branch
2. Vercel auto-deploys (if webhook configured)
3. Monitor build logs
4. Verify in preview environment
5. Approve production deployment

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- SAM.gov API: https://open.gsa.gov/api/
- USAspending.gov API: https://api.usaspending.gov/
