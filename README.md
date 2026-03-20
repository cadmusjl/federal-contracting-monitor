# Federal Contracting Monitor

Real-time federal contracting opportunity and spend analysis platform. Integrates SAM.gov and USAspending.gov public APIs with a production-ready Next.js frontend, Supabase backend, and Vercel deployment.

## Features

- Real-time integration with SAM.gov opportunities API
- Contract spending data from USAspending.gov
- Interactive charts with drill-down capability
- Multi-category filtering: Agency, Set-Aside Type, Contract Status, Opportunity Type, Spend Ranges, Dates
- Full-text search across opportunities and awards
- CSV/PDF export functionality
- Saved filters and opportunity tracking
- Dark mode support
- Responsive design for all devices
- Production-ready TypeScript

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Real-time)
- **Visualization:** Recharts
- **Deployment:** Vercel
- **APIs:** SAM.gov Public API, USAspending.gov Public API

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)
- Vercel account (optional, for deployment)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/cadmusjl/federal-contracting-monitor.git
cd federal-contracting-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure `.env.local` with your API keys:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `NEXT_PUBLIC_SAM_API_KEY` - SAM.gov API key (get from sam.gov)

5. Create Supabase tables (see Database Setup below)

6. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your project
3. Copy and paste the contents of `lib/db-schema.sql`
4. Execute the SQL to create all tables and indexes

### Database Schema

The application uses the following main tables:

- **opportunities** - Federal contracting opportunities from SAM.gov
- **contract_awards** - Contract awards from USAspending.gov
- **tracked_opportunities** - User-saved opportunities for tracking
- **saved_filters** - User-created filter configurations
- **sync_logs** - Data synchronization audit trail

## API Integration

### SAM.gov API

Fetches federal contracting opportunities in real-time.

**Endpoint:** `GET /api/opportunities`

Query Parameters:
- `source` - 'sam' for live data or 'db' for cached (default: 'db')
- `agency` - Filter by agency name
- `set_aside` - Filter by set-aside type
- `keyword` - Search keyword
- `deadline_from` - ISO date string
- `deadline_to` - ISO date string
- `est_amount_from` - Minimum estimated amount
- `est_amount_to` - Maximum estimated amount
- `page` - Page number (1-indexed)
- `limit` - Results per page (1-100, default: 25)

### USAspending.gov API

Fetches contract award data from federal spending database.

**Endpoint:** `GET /api/awards`

Query Parameters:
- `source` - 'usaspending' for live data or 'db' for cached (default: 'db')
- `agencies` - Comma-separated agency names
- `keyword` - Search keyword
- `award_amount_min` - Minimum contract value
- `award_amount_max` - Maximum contract value
- `date_from` - ISO date string
- `date_to` - ISO date string
- `page` - Page number (1-indexed)
- `limit` - Results per page (1-100, default: 25)

### Sync Endpoint

Manually trigger data synchronization from live APIs.

**Endpoint:** `POST /api/sync`

Request Body:
```json
{
  "action": "sync-opportunities" | "sync-awards",
  "source": "sam.gov" | "usaspending.gov"
}
```

## Features

### Opportunities Tab

- Search federal contracting opportunities
- Filter by agency, set-aside type, opportunity type, amount, dates
- View detailed opportunity information with SAM.gov link
- Chart visualization of opportunities by agency and amount
- Export opportunities to CSV
- Track specific opportunities for monitoring

### Awards Tab

- Browse contract awards and spending data
- Filter by agency, contract value, award dates
- View contractor and contract details
- Chart visualization of spending by agency and contractor
- Export awards to CSV

### Dashboard Features

- Interactive Recharts visualizations with drill-down
- Dark mode toggle (stored in localStorage)
- Responsive table with pagination
- Search across titles, descriptions, contractor names
- Real-time data sync from SAM.gov and USAspending.gov
- Saved filter configurations

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/cadmusjl/federal-contracting-monitor.git
git push -u origin main
```

2. Connect to Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_SAM_API_KEY`
   - Deploy

3. Configure custom domain (optional)

### Manual Deployment

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checker

## API Documentation

### Search Opportunities

```bash
curl "http://localhost:3000/api/opportunities?agency=Department%20of%20Defense&limit=10"
```

### Search Awards

```bash
curl "http://localhost:3000/api/awards?agencies=DoD&award_amount_min=1000000&limit=10"
```

### Trigger Sync

```bash
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{"action":"sync-opportunities","source":"sam.gov"}'
```

## Data Freshness

- Opportunities: Updated on-demand or via manual sync
- Awards: Updated on-demand or via manual sync
- Sync logs: Available in `sync_logs` table for audit trail

## Performance

- Indexed database queries for fast filtering
- Pagination to handle large datasets
- Charts limited to top 10 results for clarity
- Lazy loading of components
- Optimized image delivery via Next.js

## Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) ready
- Input validation on all API endpoints
- No credentials in version control
- HTTPS recommended for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: jay.cadmus@innovixdynamix.com

## Roadmap

- Authentication and user accounts
- Real-time WebSocket updates
- PDF export with charts
- Email notifications for new opportunities
- API rate limiting and caching optimization
- Mobile app with React Native
- AI-powered opportunity recommendations
// deployment trigger Fri Mar 20 18:14:12 CET 2026
