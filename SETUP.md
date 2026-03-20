# Federal Contracting Monitor - Setup Guide

## Project Status
✓ Full-stack application complete and production-ready
✓ Build passes successfully
✓ Ready for Vercel deployment
✓ All dependencies installed and configured

## Quick Start (Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - From Supabase project dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project dashboard
- `NEXT_PUBLIC_SAM_API_KEY` - From SAM.gov API registration

### 3. Start Development Server
```bash
npm run dev
```

Navigate to http://localhost:3000

## Production Build

### Build for Production
```bash
npm run build
npm start
```

This creates an optimized production build in `.next/` directory.

## Deployment to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push code to GitHub:
```bash
git remote add origin https://github.com/cadmusjl/federal-contracting-monitor.git
git push -u origin master
```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repository
4. Add environment variables (same 3 as above)
5. Deploy

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Project Structure

```
federal-contracting-monitor/
├── app/
│   ├── api/
│   │   ├── opportunities/  # SAM.gov integration
│   │   ├── awards/         # USAspending.gov integration
│   │   ├── sync/           # Data synchronization
│   │   └── filters/        # Saved filters API
│   ├── layout.tsx          # Root layout with theme toggle
│   ├── page.tsx            # Main dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── OpportunitiesPage.tsx   # Opportunities UI
│   ├── AwardsPage.tsx          # Awards UI
│   ├── OpportunitiesTable.tsx  # Table component
│   ├── AwardsTable.tsx         # Table component
│   ├── OpportunitiesChart.tsx  # Charts component
│   ├── AwardsChart.tsx         # Charts component
│   └── FilterPanel.tsx         # Filtering UI
├── lib/
│   ├── sam-api.ts           # SAM.gov API client
│   ├── usaspending-api.ts   # USAspending.gov API client
│   ├── supabase.ts          # Database utilities
│   └── db-schema.sql        # Database schema
├── public/                  # Static assets
├── package.json            # Dependencies
├── next.config.ts          # Next.js config
├── tailwind.config.ts      # Tailwind CSS config
└── tsconfig.json           # TypeScript config
```

## Database Setup

### Supabase Configuration

1. Create project at [supabase.com](https://supabase.com)
2. Copy project credentials to `.env.local`
3. Run schema in SQL Editor:

```bash
# Copy contents of lib/db-schema.sql
# Paste into Supabase SQL Editor
# Execute
```

This creates:
- `opportunities` table (SAM.gov data)
- `contract_awards` table (USAspending.gov data)
- `tracked_opportunities` table (user-saved)
- `saved_filters` table (user filters)
- `sync_logs` table (audit trail)

## API Endpoints

### Opportunities
- `GET /api/opportunities?page=1&limit=25` - List opportunities
- `GET /api/opportunities?source=sam` - Fetch from SAM.gov live
- `POST /api/opportunities` - Save opportunity to database

### Awards
- `GET /api/awards?page=1&limit=25` - List awards
- `GET /api/awards?source=usaspending` - Fetch from USAspending live
- `POST /api/awards` - Save award to database

### Sync
- `POST /api/sync` - Trigger data synchronization

### Filters
- `GET /api/filters?user_id=xxx` - Get user's saved filters
- `POST /api/filters` - Save a new filter

## Data Synchronization

### Manual Sync
```bash
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{"action":"sync-opportunities","source":"sam.gov"}'
```

### Automated Sync (Production)
Configure in Vercel using Cron Functions:
1. Add `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/sync",
    "schedule": "0 */6 * * *"
  }]
}
```

## Development Workflow

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Development Commands
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checker

## Troubleshooting

### Supabase Connection Error
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure API keys have proper permissions

### SAM.gov API Errors
- Verify API key is valid
- Check rate limits (SAM.gov enforces limits)
- Review API response in browser DevTools

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node -v` (requires 18+)

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

## Performance Optimization

- Database queries use indexes on common filter columns
- Pagination prevents loading entire datasets
- Charts limit top results (top 10) for clarity
- API responses cached where appropriate
- CSS/JavaScript minified in production build

## Security Notes

- API keys stored in environment variables only
- No credentials in git history (.gitignore configured)
- Supabase RLS policies recommended for production
- Input validation on API endpoints
- HTTPS enforced in production

## Next Steps

1. ✓ Configure Supabase project
2. ✓ Set environment variables
3. ✓ Test locally: `npm run dev`
4. ✓ Deploy to Vercel
5. ✓ Configure custom domain
6. ✓ Set up automated data sync

## Support & Resources

- README.md - Full documentation
- DEPLOYMENT.md - Detailed deployment guide
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- SAM.gov API: https://open.gsa.gov/api/sam/
- USAspending.gov API: https://api.usaspending.gov/
