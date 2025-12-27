# Flex Reviews Dashboard

Property review management system for Flex Living with analytics and approval workflow.

## Tech Stack

- **Next.js 15** - App Router with TypeScript
- **TypeScript** - Full type safety across codebase
- **Mantine UI v7** - Core components, charts, and date pickers
- **Zustand** - Client-side state management
- **dayjs** - Date manipulation
- **Recharts** - Data visualization (via Mantine Charts)
- **Tabler Icons** - UI iconography

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and log in with:

- Email: `manager@flex.com`
- Password: `flex2024`

## Key Design Decisions

### Architecture

**Server-First Approach**: Default to Server Components for data fetching and static rendering. Client Components (`'use client'`) only where interactivity is required (forms, charts, modals).

**State Management**: Zustand handles client-side state (filters, sorting, selected property). Avoids prop drilling while keeping bundle size minimal compared to Redux.

**In-Memory Data Store**: Reviews stored in memory on server startup via singleton pattern. Production would use PostgreSQL, but this demonstrates API design and normalization logic without infrastructure overhead.

**Auto-Approval on Startup**: Server automatically approves representative reviews per property (3 for Shoreditch, 2 for Camden, 4 for Brixton) to showcase public pages immediately. Selections align with each property's narrative (excellence, decline, channel polarization).

### Data Flow

1. Mock data loaded from `data/mock-reviews.json` on server initialization
2. Reviews normalized and grouped by property in `reviewsStore`
3. API routes serve normalized data to client
4. Dashboard fetches on mount, stores in Zustand
5. Client-side filtering/sorting for instant UI updates
6. Metrics calculated on-demand per property change

### Code Quality

Following DRY principles:

- Shared utilities in `lib/utils/helpers.ts` (rating colors, formatting, calculations)
- Reusable components with single responsibilities
- Type definitions centralized in `types/` directory
- Maximum function length: 50 lines

Performance optimizations:

- `useMemo` for expensive calculations (metrics, filtered data)
- `useCallback` for event handlers passed to children
- Server Components by default reduce client bundle size

## API Routes

### Authentication

**POST /api/auth/login**

```json
{
  "email": "manager@flex.com",
  "password": "flex2024"
}
```

Returns success status and sets HTTP-only auth cookie.

### Reviews

**GET /api/reviews/hostaway** _(tested by assessment)_

Returns all normalized reviews across all properties.

**POST /api/reviews/[id]/approve**

```json
{
  "approved": true
}
```

Updates review approval status. Changes persist in-memory only (resets on restart).

**GET /api/reviews/public/[propertyId]**

Returns only approved reviews for a property, sorted by date descending.

## Analytics Implementation

**Category Performance**: Calculates 30-day rolling average per category (cleanliness, communication, location, value). Status thresholds: critical < 7, warning < 8, good ≥ 8.

**Sentiment Analysis**: Keyword extraction from review text. Negative keywords tracked in reviews rated < 7, positive in reviews > 8. Top 5 matches returned.

**Action Items**: Auto-generated from recurring patterns (≥3 mentions). Maps keywords to specific recommendations (e.g., "dirty" → cleanliness audit, "wifi" → connectivity upgrade).

**Critical Reviews**: Auto-flagged if rating < 6 OR any category < 5 within last 30 days. Limited to 5 most recent.

**Trend Data**: 6-month rolling window grouped by month. Shows overall and per-category averages.

## Mock Data Strategy

74 reviews across 3 properties demonstrating distinct scenarios:

**Shoreditch Heights Studio (prop-001)**: Excellence baseline. 33 reviews spanning July-December 2024, avg rating 9.2. Consistently high ratings (8-10) across all categories. Designed to showcase successful property management with steady performance. Includes positive keywords throughout ("clean", "spotless", "excellent location", "responsive host").

**Camden Loft (prop-002)**: Declining performance narrative. 22 reviews showing clear deterioration from 8.5 (July-Aug) to 6.2 (Nov-Dec). Contains 8 mentions of "dirty", 3 of "mold/moldy", focused complaints about bathroom and kitchen cleanliness. Distribution weighted toward later months to demonstrate trend. Intentionally triggers critical issues alerts and generates action items (cleanliness audit, maintenance review). Mix of channels with Booking.com reviews more critical than Airbnb.

**Brixton Apartment (prop-003)**: Channel polarization case study. 19 reviews demonstrating platform-specific guest expectations. Airbnb guests (11 reviews, avg 8.9) respond positively to "charming", "authentic", "local character" narrative. Booking.com/Expedia guests (8 reviews, avg 6.5) flag "expensive", "small", "not as described" value concerns. Same property, different perceptions based on booking platform and guest demographics.

## Google Reviews Integration

See [google-reviews-findings.md](google-reviews-findings.md) for detailed research.

## Project Structure

```
app/
├── api/              # Next.js API routes
├── dashboard/        # Manager dashboard (protected)
├── property/[id]/    # Public property pages
└── login/            # Authentication

components/
├── dashboard/        # Dashboard-specific components
├── property/         # Property page components
└── shared/           # Reusable components

lib/
├── analytics/        # Metrics calculation and sentiment analysis
├── data/             # Data store and property details
├── store/            # Zustand state management
└── utils/            # Shared utilities (DRY principle)

types/                # TypeScript type definitions
data/                 # Mock review data
```

## Development Notes

**Approval Persistence**: Review approval changes persist in-memory only. Restarting the server resets all approvals to initial auto-approved state. Production would require database persistence.

**Image Strategy**: Property images use Unsplash Source API with seeded keywords. Zero storage footprint, CDN-hosted, consistent per property.

**Responsive Design**: Mobile-first approach. Dashboard header adapts: icons hidden on small screens, full labels on desktop. Property pages use two-column layout on desktop, stack on mobile.

## Deployment

### Vercel (Recommended)

This application is optimized for Vercel deployment:

1. Push code to GitHub/GitLab/Bitbucket
2. Visit [vercel.com](https://vercel.com) and import your repository
3. Vercel auto-detects Next.js configuration
4. Click "Deploy"

**Environment Variables**: None required for demo deployment.

**Post-Deployment**: Visit your Vercel URL, log in with `manager@flex.com` / `flex2024`

### Local Production Build

```bash
npm run build
npm run start
```

Test at `http://localhost:3000`
