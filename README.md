# Flex Reviews Dashboard

Property review management system for The Flex with analytics and approval workflow.

## Tech Stack

- **Next.js 16** - App Router with TypeScript
- **Mantine UI v7** - Components, charts, and date pickers
- **Zustand** - Client-side state management
- **dayjs** - Date manipulation
- **Recharts** - Data visualization (via Mantine Charts)
- **Tabler Icons** - UI iconography
- **BroadcastChannel API** - Real-time cross-tab communication

## Quick Start

```bash
npm install
npm run dev
```

Create `.env.local` with:

```
AUTH_EMAIL=manager@flex.com
AUTH_PASSWORD=flex2024
```

Visit `http://localhost:3000` and log in with `manager@flex.com` / `flex2024`

## Key Design Decisions

### Architecture

**Server-First Approach**: Default to Server Components for data fetching and static rendering. Client Components (`'use client'`) only where interactivity is required (forms, charts, modals).

**State Management**: Zustand handles client-side state (filters, sorting, selected property) to avoid prop drilling with minimal bundle size.

**In-Memory Data Store**: Reviews stored in memory via singleton pattern. Production would use PostgreSQL, but this demonstrates API design and normalization without infrastructure overhead.

**Auto-Approval on Startup**: Server automatically approves representative reviews per property (3 for Shoreditch, 2 for Camden, 4 for Brixton) to showcase public pages immediately. Selections align with each property's narrative (excellence, decline, channel polarization).

**Real-Time Cross-Tab Sync**: BroadcastChannel API enables instant updates between dashboard and property pages across browser tabs. When a manager approves/removes approval in the dashboard, property detail pages update immediately without refresh. Singleton pattern ensures efficient channel management and prevents race conditions.

### Data Flow

1. Mock data loaded from `data/mock-reviews.json` on server initialization
2. Reviews normalized and grouped by property in `reviewsStore`
3. API routes serve normalized data to client
4. Dashboard fetches on mount, stores in Zustand
5. Client-side filtering/sorting for instant UI updates
6. Metrics calculated on-demand per property change
7. Approval changes broadcast to all tabs via `broadcastManager` after successful API update

### Code Quality

**DRY Principles**: Shared utilities in `lib/utils/` (rating colors, formatting, calculations, BroadcastChannel management), reusable single-responsibility components, centralized type definitions in `types/`, max 50-line functions.

**Performance**: `useMemo` for expensive calculations (metrics, filtered data), `useCallback` for event handlers, Server Components reduce client bundle size, singleton BroadcastChannel manager prevents redundant channel creation.

## Data Normalization

The `/api/reviews/hostaway` endpoint transforms raw Hostaway API data, adding:

- `propertyId` - Mapped from `listingName` (e.g., "Shoreditch Heights Studio" → "prop-001")
- `propertyName` - Clean property name for display
- `channelName` - Human-readable channel (resolved from `channelId`: 2018 → "Airbnb")
- `categories` - Alias for `reviewCategory` array
- `approved` - Review approval status (defaults `false`, managed via dashboard)
- `rating` - Calculated from category averages when null

**Response format matches Hostaway API:**

```json
{
  "status": "success",
  "result": [...],
  "count": 74,
  "offset": null
}
```

## API Routes

**POST /api/auth/login** - `{email, password}` - Returns success status and sets HTTP-only auth cookie.

**GET /api/reviews/hostaway** _(tested by assessment)_ - Returns all normalized reviews across all properties.

**POST /api/reviews/[id]/approve** - `{approved: true}` - Updates review approval status. Changes persist in-memory only (resets on restart).

**GET /api/reviews/public/[propertyId]** - Returns only approved reviews for a property, sorted by date descending.

## Analytics Implementation

**Category Performance**: Calculates 30-day rolling average per category (cleanliness, communication, location, value). Status thresholds: critical < 7, warning < 8, good ≥ 8.

**Sentiment Analysis**: Keyword extraction from review text. Negative keywords tracked in reviews rated < 7, positive in reviews > 8. Top 5 matches returned.

**Action Items**: Auto-generated from recurring patterns (≥3 mentions). Maps keywords to specific recommendations (e.g., "dirty" → cleanliness audit, "wifi" → connectivity upgrade).

**Critical Reviews**: Auto-flagged if rating < 6 OR any category < 5 within last 30 days. Limited to 5 most recent.

**Trend Data**: 6-month rolling window grouped by month. Shows overall and per-category averages.

## Mock Data Strategy

74 reviews across 3 properties demonstrating distinct scenarios:

**Shoreditch Heights Studio (prop-001)**: Excellence baseline. 33 reviews (July-Dec 2024), avg 9.2. Consistently high ratings (8-10) across all categories showcasing successful property management. Positive keywords: "clean", "spotless", "excellent location", "responsive host".

**Camden Loft (prop-002)**: Declining performance narrative. 22 reviews deteriorating from 8.5 (July-Aug) to 6.2 (Nov-Dec). 8× "dirty", 3× "mold/moldy", bathroom/kitchen complaints. Distribution weighted toward later months. Triggers critical issues alerts and action items (cleanliness audit, maintenance review). Booking.com reviews more critical than Airbnb.

**Brixton Apartment (prop-003)**: Channel polarization case study. 19 reviews showing platform-specific expectations. Airbnb guests (11 reviews, avg 8.9) respond to "charming", "authentic", "local character". Booking.com/Expedia guests (8 reviews, avg 6.5) flag "expensive", "small", "not as described". Same property, different perceptions by platform.

## Google Reviews Integration

See [google-reviews-findings.md](google-reviews-findings.md) for detailed findings.

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
└── utils/            # Shared utilities (helpers, BroadcastChannel manager, DRY principle)

types/                # TypeScript type definitions
data/                 # Mock review data
```

## Development Notes

**Approval Persistence**: Review approval changes persist in-memory only. Restarting the server resets all approvals to initial auto-approved state. Production would require database persistence.

**Image Strategy**: Property images use Unsplash Source API with seeded keywords. Zero storage footprint, CDN-hosted, consistent per property.

**Responsive Design**: Mobile-first approach. Dashboard header adapts: icons hidden on small screens, full labels on desktop. Property pages use two-column layout on desktop, stack on mobile.

## Deployment

**Live Demo**: [flex-reviews-dashboard-lemon.vercel.app](https://flex-reviews-dashboard-lemon.vercel.app)

This project was deployed on Vercel with the following ENV variables:

```
AUTH_EMAIL=manager@flex.com
AUTH_PASSWORD=flex2024
```

### Deploying Your Own Instance

1. Push code to GitHub/GitLab/Bitbucket
2. Visit [vercel.com](https://vercel.com) and import repository
3. Add environment variables in Vercel dashboard:
   - `AUTH_EMAIL` - Login email
   - `AUTH_PASSWORD` - Login password
4. Deploy (Vercel auto-detects Next.js configuration)
