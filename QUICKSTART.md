# Quick Start - Federal Contracting Monitor

## 🚀 Get Running in 5 Minutes

### 1. Clone/Setup (30 seconds)
```bash
# You already have the code - it's in this directory
npm install  # Install dependencies (1-2 min)
```

### 2. Configure Environment (1 minute)
```bash
cp .env.example .env.local
# Edit .env.local and add:
# - NEXT_PUBLIC_SUPABASE_URL (from Supabase)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase)
# - NEXT_PUBLIC_SAM_API_KEY (from SAM.gov)
```

### 3. Start Dev Server (30 seconds)
```bash
npm run dev
# Opens at http://localhost:3000
```

### 4. View Application
- Click "Opportunities" tab to search federal opportunities
- Click "Awards" tab to view contract spending
- Use Filters button to narrow results
- Click View Chart to see visualizations
- Click Export CSV to download data
- 🌙 button in top-right toggles dark mode

## 📊 Features Ready to Use

### Opportunities
- Real-time SAM.gov data integration
- Filter by: Agency, Set-Aside Type, Dates, Amount
- Interactive bar charts by agency
- Search by title or description
- CSV export
- View SAM.gov listing directly

### Contract Awards
- USAspending.gov integration
- Filter by: Agency, Contract Value, Award Dates
- Top contractors visualization
- Spending by agency breakdown
- Search contracts by contractor name
- CSV export

### Dashboard
- Dark mode toggle (auto-saves preference)
- Responsive design (works on mobile/tablet/desktop)
- Paginated results (25 per page, configurable)
- Drill-down charts with interactivity

## 🔧 Key Endpoints (for testing)

```bash
# Get opportunities from database
curl "http://localhost:3000/api/opportunities?limit=5"

# Get opportunities from SAM.gov live
curl "http://localhost:3000/api/opportunities?source=sam&limit=5"

# Get awards from database  
curl "http://localhost:3000/api/awards?limit=5"

# Trigger data sync
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{"action":"sync-opportunities","source":"sam.gov"}'
```

## 📁 Where Things Are

```
.
├── app/                    ← Application pages & routes
│   ├── page.tsx           ← Dashboard home
│   ├── layout.tsx         ← Root layout with nav & theme
│   ├── api/               ← API endpoints
│   └── globals.css        ← Styling
├── components/            ← React components
│   ├── OpportunitiesPage.tsx  ← Opportunities UI
│   └── AwardsPage.tsx         ← Awards UI
├── lib/                   ← Utilities
│   ├── sam-api.ts         ← SAM.gov integration
│   ├── usaspending-api.ts ← USAspending integration
│   ├── supabase.ts        ← Database client
│   └── db-schema.sql      ← Database tables
├── package.json           ← Dependencies
├── next.config.ts         ← Next.js configuration
└── tailwind.config.ts     ← Styling configuration
```

## 🗄️ Database Setup

### Need Supabase? 
1. Go to [supabase.com](https://supabase.com)
2. Create free account
3. Create new project
4. Copy `URL` and `anon key` to `.env.local`
5. Go to SQL Editor in Supabase dashboard
6. Copy entire contents of `lib/db-schema.sql`
7. Paste and execute in SQL Editor
8. Done! Your database is ready

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code style
npm run type-check   # Check TypeScript types
```

## 🌐 Deploy to Vercel

1. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/federal-contracting-monitor.git
git push -u origin master
```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import GitHub repo
4. Add 3 environment variables (same as `.env.local`)
5. Deploy

Done! Your app is live at `your-project.vercel.app`

## 🆘 Troubleshooting

### Dev server won't start
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### API returns empty data
- Check environment variables are set
- Verify Supabase project is active
- Check SAM.gov API key is valid

### Database queries fail
- Verify Supabase SQL schema was created
- Check `NEXT_PUBLIC_SUPABASE_*` environment variables
- Test connection: `curl "http://localhost:3000/api/opportunities"`

### Build fails
```bash
npm run type-check   # Check for TypeScript errors
npm run lint         # Check for linting errors
npm install          # Ensure all packages installed
```

## 📚 Full Documentation

- **README.md** - Complete feature documentation
- **DEPLOYMENT.md** - Detailed deployment guide
- **SETUP.md** - Development setup guide
- **BUILD_REPORT.md** - Technical build report

## 💡 Pro Tips

1. **Dark Mode:** Click 🌙 in top-right, preference saves to browser
2. **Filters:** Click "Filters" button to reveal multi-category filter panel
3. **Charts:** Switch between table and chart view for visualizations
4. **Export:** Download filtered results as CSV file
5. **Search:** Use search box to find opportunities/awards by keyword

## 🎯 Common Tasks

### Search for specific opportunities
1. Click Opportunities tab
2. Type keywords in search box
3. Click Search button
4. Refine with Filters if needed

### Find contract awards for an agency
1. Click Awards tab
2. Click Filters button
3. Select Agency from dropdown
4. Results update automatically

### View spending trends
1. Click Awards tab
2. Click "View Chart" button
3. See bar charts and pie charts
4. Hover over charts for details

### Save filter configuration
1. Set desired filters
2. Note the filter configuration
3. Save in your notes for reuse
4. (Future version: Save button coming)

### Export data
1. Set filters and search
2. Click "Export CSV" button
3. File downloads to your Downloads folder
4. Open in Excel or Google Sheets

## 🚀 Next Steps

1. ✓ Install dependencies
2. ✓ Set environment variables  
3. ✓ Start dev server locally
4. ✓ Test features
5. → Configure Supabase (if needed)
6. → Deploy to Vercel
7. → Set up automated data sync

## Questions?

See detailed docs:
- Issues with setup → **SETUP.md**
- Deploying to production → **DEPLOYMENT.md**
- How features work → **README.md**
- Technical details → **BUILD_REPORT.md**

---

**Status:** ✓ Production Ready | **Build:** ✓ Successful | **Tests:** Ready for integration testing
