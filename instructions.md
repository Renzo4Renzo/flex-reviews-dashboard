# Comprehensive Development Guide for Flex Reviews Dashboard

## Code Quality Principles

### DRY (Don't Repeat Yourself)

- Create shared utility functions for repeated logic (rating colors, date formatting, calculations)
- Consolidate helper functions in `lib/utils/helpers.ts`
- Reuse type definitions with TypeScript utility types (Pick, Omit, Partial)
- Extract common component patterns into reusable components

### Efficiency

- Minimize re-renders with React.memo for pure components
- Use useMemo for expensive calculations (metrics, filtering)
- useCallback for event handlers passed to children
- Optimize bundle size: import specific icons, not entire libraries
- Server Components by default, Client Components only when needed
- Cache API responses on server with Next.js caching

### Readability

- Clear, descriptive variable and function names
- Single Responsibility Principle: each function does one thing
- Consistent code formatting
- Type annotations for clarity
- Comments only for complex business logic
- Maximum function length: 50 lines (extract if longer)

## Phase 1: Setup & Installation

### Prompt for Claude Code:

```
Initialize a new Next.js 15 project with TypeScript and Tailwind CSS:

1. Run: npx create-next-app@latest flex-reviews-dashboard
   - Choose: TypeScript (Yes), ESLint (Yes), Tailwind CSS (Yes), App Router (Yes), Import alias (Yes, use @/*)
   - No src directory

2. Install Mantine dependencies:
   - @mantine/core @mantine/hooks
   - @mantine/charts recharts
   - @mantine/dates dayjs
   - zustand
   - @tabler/icons-react
   - Install as regular dependencies (not dev)

3. Create Mantine providers configuration:
   - File: app/providers.tsx
   - Create a 'use client' component
   - Import MantineProvider and createTheme from @mantine/core
   - Create custom theme with:
     * primaryColor: 'blue'
     * fontFamily: system font stack
     * headings fontWeight: '700'
     * defaultRadius: 'md'
   - Export Providers component that wraps children with MantineProvider

4. Update app/layout.tsx:
   - Import Mantine CSS files: '@mantine/core/styles.css', '@mantine/charts/styles.css', '@mantine/dates/styles.css'
   - Import the Providers component
   - Import ColorSchemeScript from @mantine/core
   - Add ColorSchemeScript in <head>
   - Wrap children with Providers component
   - Set metadata: title "Flex Reviews Dashboard", description "Manager dashboard for property reviews"

5. Create folder structure:
   - app/api/auth/login/
   - app/api/reviews/hostaway/
   - app/api/reviews/[id]/approve/
   - app/api/reviews/public/[propertyId]/
   - app/dashboard/
   - app/property/[id]/
   - app/login/
   - components/dashboard/
   - components/property/
   - components/shared/
   - lib/store/
   - lib/analytics/
   - lib/data/
   - lib/utils/
   - data/
   - types/

6. Create a test component in app/page.tsx that imports and renders a Mantine Button to verify setup works

Verify:
- Run npm run dev
- Visit http://localhost:3000
- Confirm Mantine button renders with styling
- No console errors
```

---

## Phase 2: Type Definitions & Data Layer

### Prompt for Claude Code:

```
Create TypeScript type definitions and data layer utilities:

1. Create types/review.ts with these interfaces:

   HostawayReview interface matching the API structure:
   - id: number
   - type: 'host-to-guest' | 'guest-to-host'
   - status: string
   - rating: number | null (can be null)
   - publicReview: string
   - reviewCategory: array of ReviewCategory objects
   - submittedAt: string (ISO date)
   - guestName: string
   - listingName: string
   - channelId: number

   ReviewCategory interface:
   - category: union type of 'cleanliness' | 'communication' | 'location' | 'value'
   - rating: number

   NormalizedReview interface (internal format after processing):
   - All fields from HostawayReview
   - Add propertyId: string (extracted from listingName)
   - Add propertyName: string
   - Change rating to always be number (calculated from categories if null in API)
   - Add categories: ReviewCategory[] (same as reviewCategory)
   - Add channelName: string (mapped from channelId)
   - Add approved: boolean (defaults false)

   PropertyReviews interface:
   - propertyId: string
   - propertyName: string
   - reviews: NormalizedReview[]

2. Create types/analytics.ts with these interfaces:

   CategoryPerformance:
   - category: string
   - avgRating: number
   - delta30d: number (30-day trend comparison)
   - status: 'critical' | 'warning' | 'good'

   TrendDataPoint (for chart data):
   - month: string (e.g., "Aug")
   - avgRating: number
   - cleanliness: number
   - communication: number
   - location: number
   - value: number
   - count: number

   ChannelStats:
   - channelId: number
   - channelName: string
   - avgRating: number
   - count: number
   - status: 'critical' | 'warning' | 'good'

   KeywordMatch:
   - phrase: string
   - count: number
   - reviewIds: number[]

   SentimentData:
   - negative: KeywordMatch[]
   - positive: KeywordMatch[]
   - actionItems: string[]

   CriticalReview:
   - id: number
   - date: string
   - channelName: string
   - guestName: string
   - rating: number
   - worstCategory: { category: string; rating: number }
   - excerpt: string
   - fullReview: string
   - approved: boolean

   PropertyMetrics (aggregates all analytics):
   - propertyId: string
   - propertyName: string
   - totalReviews: number
   - approvedReviews: number
   - avgRating: number
   - ratingDelta: number
   - categoryPerformance: CategoryPerformance[]
   - trendData: TrendDataPoint[]
   - channelStats: ChannelStats[]
   - sentiment: SentimentData
   - criticalReviews: CriticalReview[]

3. Create lib/utils/channelMapping.ts:

   Create a constant CHANNEL_MAP as Record<number, string>:
   - 2018 maps to 'Airbnb'
   - 2005 maps to 'Booking.com'
   - 2007 maps to 'Expedia'

   Export function getChannelName that takes channelId number and returns the channel name string or 'Unknown Channel' if not found

   Export function getAllChannels that returns array of objects with id and name properties

4. Create lib/utils/normalizeReview.ts:

   Import HostawayReview and NormalizedReview types
   Import getChannelName utility

   Create normalizeReview function that:
   - Takes HostawayReview, propertyId string, and propertyName string as inputs
   - Returns NormalizedReview
   - If rating is null, calculates average from reviewCategory array using calculateAverageFromCategories
   - Uses provided propertyId and propertyName (passed from parent PropertyReviews object)
   - Maps channelId to channelName using getChannelName
   - Sets approved to false by default
   - Returns complete normalized object with all fields

   Create helper calculateAverageFromCategories function that:
   - Takes ReviewCategory array
   - Calculates average of all ratings
   - Rounds to 1 decimal place
   - Returns the average

5. Create lib/utils/dateHelpers.ts:

   Import dayjs

   Export formatDate function: formats date string to "MMM DD, YYYY"
   Export formatDateShort function: formats to "MMM DD"
   Export getDateRange function: returns start and end dates for last N days
   Export isWithinRange function: checks if date falls within range, returns true if start or end is null
   Export groupByMonth function: groups reviews array by month in "YYYY-MM" format, returns Map
   Export getLast6Months function: returns array of last 6 month strings in "YYYY-MM" format

6. Create lib/data/reviewsStore.ts:

   Import PropertyReviews, NormalizedReview, and HostawayReview types
   Import normalizeReview function
   Import rawMockData from @/data/mock-reviews.json

   Define HostawayApiResponse interface matching real API:
   - status: string
   - result: HostawayReview[]
   - count: number
   - offset: number | null

   Create PROPERTY_MAP constant mapping listingName to {id, name}:
   - 'Shoreditch Heights Studio': {id: 'prop-001', name: 'Shoreditch Heights Studio'}
   - 'Camden Loft': {id: 'prop-002', name: 'Camden Loft'}
   - 'Brixton Apartment': {id: 'prop-003', name: 'Brixton Apartment'}

   Create ReviewsDataStore class as singleton with:

   Private field data: PropertyReviews[] | null initialized to null

   Method initialize:
   - Casts rawMockData as HostawayApiResponse
   - Extracts result array from API response
   - Groups reviews by property using listingName lookup in PROPERTY_MAP
   - For each review, normalizes it using normalizeReview with propertyId and propertyName from PROPERTY_MAP
   - Stores grouped PropertyReviews array in this.data
   - Only initializes once (checks if data already exists)

   Method getAll:
   - Calls initialize if needed
   - Returns all PropertyReviews array

   Method getByProperty:
   - Takes propertyId string
   - Returns PropertyReviews for that property or undefined

   Method getAllReviews:
   - Returns flattened array of all NormalizedReviews across all properties

   Method updateReviewApproval:
   - Takes reviewId number and approved boolean
   - Finds review across all properties
   - Updates approved flag
   - Returns updated review or null if not found

   Method getApprovedByProperty:
   - Takes propertyId string
   - Returns array of approved reviews for that property
   - Sorts by date newest first

   Export singleton instance as reviewsStore

Verify:
- Run npm run build
- Check for TypeScript compilation errors
- All types should be properly defined
```

---

## Phase 3: API Routes

### Prompt for Claude Code:

```
Create Next.js API routes for authentication and reviews:

1. Create middleware.ts in root directory:

   Import NextResponse and NextRequest from next/server

   Export middleware function that:
   - Checks if pathname starts with '/dashboard'
   - If yes, verifies 'auth' cookie exists and equals 'true'
   - If no cookie, redirects to '/login'
   - Otherwise allows request through

   Export config object with matcher: '/dashboard/:path*'

2. Create app/api/auth/login/route.ts:

   Export async POST handler that:
   - Accepts JSON body with email and password
   - Checks hardcoded credentials: email 'manager@flex.com' and password 'flex2024'
   - On success:
     * Creates NextResponse with success true
     * Sets HTTP-only cookie named 'auth' with value 'true'
     * Cookie options: httpOnly true, secure in production, sameSite lax, maxAge 24 hours
     * Returns response
   - On failure:
     * Returns success false with error message and 401 status
   - Wraps in try-catch returning 500 on exceptions

3. Create app/api/reviews/hostaway/route.ts:

   IMPORTANT: This route will be tested by the assessment

   Export async GET handler that:
   - Imports reviewsStore
   - Calls reviewsStore.getAllReviews()
   - Returns JSON with success true, reviews array, and count
   - Has error handling with try-catch returning 500 on failure
   - Logs errors to console

4. Create app/api/reviews/[id]/approve/route.ts:

   Export async POST handler that:
   - Takes route params with id string
   - Accepts JSON body with approved boolean
   - Validates approved is boolean, returns 400 if invalid
   - Parses id to number
   - Calls reviewsStore.updateReviewApproval
   - Returns 404 if review not found
   - Returns success true with updated review on success
   - Has try-catch error handling returning 500

5. Create app/api/reviews/public/[propertyId]/route.ts:

   Export async GET handler that:
   - Takes route params with propertyId string
   - Calls reviewsStore.getByProperty
   - Returns 404 if property not found
   - Calls reviewsStore.getApprovedByProperty
   - Returns JSON with success true, propertyName, reviews array, and count
   - Has try-catch error handling returning 500

Verify:
- Run npm run build for TypeScript errors
- Start dev server
- Test with curl:
  * POST /api/auth/login with valid credentials should return success and set cookie
  * POST /api/auth/login with invalid credentials should return 401
  * GET /api/reviews/hostaway should return empty array (no mock data yet)
```

---

## Phase 4: Analytics Layer

### Prompt for Claude Code:

```
Create analytics functions for sentiment analysis and metrics calculation:

1. Create lib/analytics/sentimentAnalysis.ts:

   Define NEGATIVE_KEYWORDS array containing strings:
   dirty, filthy, unclean, mold, moldy, noisy, loud, noise, broken, not working, damaged, expensive, overpriced, not worth, slow wifi, bad wifi, no wifi, uncomfortable, small, tiny, rude, unresponsive, unhelpful, smell, smelly, odor

   Define POSITIVE_KEYWORDS array containing strings:
   clean, spotless, pristine, comfortable, cozy, spacious, location, convenient, central, responsive, helpful, friendly, quiet, peaceful, value, worth, great price, modern, updated, nice

   Export extractKeywords function that:
   - Takes reviews string array and targetKeywords string array
   - Loops through each review converting to lowercase
   - For each target keyword checks if review includes it
   - Tracks count and review indices containing each keyword
   - Creates KeywordMatch objects with phrase, count, and reviewIds
   - Sorts by count descending
   - Returns top 5 matches

   Export analyzeSentiment function that:
   - Takes NormalizedReview array
   - Splits into negativeReviews (rating less than 7) and positiveReviews (rating greater than 8)
   - Extracts keywords from negative reviews using NEGATIVE_KEYWORDS
   - Extracts keywords from positive reviews using POSITIVE_KEYWORDS
   - Generates action items by calling generateActionItems
   - Returns SentimentData object with negative, positive, and actionItems

   Create generateActionItems helper that:
   - Takes KeywordMatch array
   - For each phrase with count 3 or more:
     * If contains dirty, clean, or mold: action about cleanliness complaints
     * If contains noisy, noise, or loud: action about noise insulation
     * If contains expensive, price, or worth: action about pricing strategy
     * If contains wifi: action about internet upgrade
     * If contains broken or damaged: action about repairs
   - Returns array of max 5 action items

2. Create lib/analytics/calculateMetrics.ts:

   Import all necessary types from analytics
   Import analyzeSentiment from sentimentAnalysis
   Import date helpers groupByMonth and getLast6Months
   Import dayjs

   Export calculatePropertyMetrics function that:
   - Takes NormalizedReview array
   - Returns empty metrics if array is empty
   - Extracts propertyId and propertyName from first review
   - Calculates:
     * totalReviews as array length
     * approvedReviews as count where approved is true
     * avgRating as average of all ratings
     * ratingDelta by calling calculateRatingDelta
     * categoryPerformance by calling calculateCategoryPerformance
     * trendData by calling calculateTrendData
     * channelStats by calling calculateChannelStats
     * sentiment by calling analyzeSentiment
     * criticalReviews by calling findCriticalReviews
   - Returns complete PropertyMetrics object

   Create calculateAverage helper that:
   - Takes number array
   - Returns sum divided by length rounded to 1 decimal
   - Returns 0 if array empty

   Create calculateRatingDelta helper that:
   - Gets current date
   - Calculates dates for 30 and 60 days ago
   - Filters reviews into last30Days and previous30Days based on submittedAt
   - Calculates average for each period
   - Returns delta (last30Avg minus previous30Avg) rounded to 1 decimal

   Create calculateCategoryPerformance helper that:
   - For each category: cleanliness, communication, location, value
   - Extracts all ratings for that category from all reviews
   - Calculates overall average
   - Calculates last 30 days average and previous 30 days average
   - Calculates delta30d
   - Determines status: critical if avgRating less than 7, warning if less than 8, else good
   - Returns CategoryPerformance array

   Create calculateTrendData helper that:
   - Gets last 6 months using getLast6Months
   - Groups reviews by month using groupByMonth
   - For each month:
     * If no reviews, returns zeroed TrendDataPoint
     * Calculates overall avgRating
     * Calculates average for each category
     * Formats month as three-letter abbreviation
     * Includes count of reviews
   - Returns TrendDataPoint array

   Create calculateChannelStats helper that:
   - Groups reviews by channelId
   - For each channel:
     * Calculates avgRating
     * Counts reviews
     * Determines status using same logic as categories
     * Gets channelName from first review in group
   - Sorts by avgRating descending
   - Returns ChannelStats array

   Create findCriticalReviews helper that:
   - Gets date 30 days ago
   - Filters reviews where:
     * submittedAt is within last 30 days AND
     * (rating less than 6 OR any category rating less than 5)
   - For each critical review:
     * Finds worst category (lowest rating)
     * Creates CriticalReview object with all info
     * Sets excerpt as first 100 characters of publicReview
   - Sorts by date newest first
   - Returns top 5

Verify:
- Run npm run build
- Check for TypeScript errors
- All functions should compile correctly
```

---

## Phase 5: State Management (Zustand)

### Prompt for Claude Code:

```
Create Zustand stores for client-side state management:

1. Create lib/store/authStore.ts:

   Import create from zustand

   Define AuthState interface with:
   - isAuthenticated: boolean
   - login: function returning void
   - logout: function returning void

   Create store with initial isAuthenticated false
   login action sets isAuthenticated to true
   logout action sets isAuthenticated to false and clears auth cookie by setting it to expired

   Export as useAuthStore

2. Create lib/store/dashboardStore.ts:

   Import create from zustand
   Import NormalizedReview type

   Define FilterState interface with:
   - channels: string array
   - categories: string array
   - dateRange: tuple of two Date or null
   - ratingRange: tuple of two numbers

   Define DashboardState interface with:
   - selectedPropertyId: string
   - reviews: NormalizedReview array
   - filters: FilterState
   - sortBy: union of 'date' | 'rating' | 'channel'
   - sortOrder: union of 'asc' | 'desc'
   - setSelectedProperty: function taking id string
   - setReviews: function taking reviews array
   - setFilters: function taking partial FilterState
   - setSorting: function taking by and order strings
   - clearFilters: function
   - getFilteredReviews: function returning filtered NormalizedReview array

   Create initialFilters constant with empty arrays for channels and categories, null dateRange, and ratingRange of 1 to 10

   Create store with:
   - Initial selectedPropertyId as 'prop-001'
   - Empty reviews array
   - filters as initialFilters
   - sortBy as 'date'
   - sortOrder as 'desc'

   Actions:
   - setSelectedProperty updates selectedPropertyId
   - setReviews updates reviews array
   - setFilters merges new filters with existing
   - setSorting updates sortBy and sortOrder
   - clearFilters resets to initialFilters

   getFilteredReviews selector:
   - Gets current reviews and filters from state
   - Applies channel filter if channels array not empty
   - Applies category filter (reviews must have at least one matching category)
   - Applies date range filter if both dates set
   - Applies rating range filter
   - Sorts based on sortBy and sortOrder
   - Returns filtered sorted array

   Export as useDashboardStore

Verify:
- Run npm run build
- Check for TypeScript errors
```

---

## Phase 6: Mock Data Creation

### Prompt for Claude Code:

```
Create data/mock-reviews.json matching the Hostaway API response structure with 39 total reviews.

IMPORTANT: The file must match the real Hostaway API format from the assessment PDF.

Top-level structure (HostawayApiResponse):
- status: "success"
- result: array of review objects (flat array, not grouped by property)
- count: 39
- offset: null

PROPERTY 1: Shoreditch Heights Studio (prop-001)
Excellence baseline showing successful management
- 12 reviews spread July-December 2024
- Average rating: 9.0-9.5 range
- All categories consistently 8-10
- Distribution: Aug 3 reviews, Sep 2, Oct 2, Nov 3, Dec 2
- Channels: Airbnb 7 reviews, Booking.com 4, Expedia 1
- Review texts include positive keywords: clean, location, comfortable, responsive, spotless, excellent
- Guest names format: FirstName L. (Sarah M., James P., etc.)
- Review IDs: 1001-1012

PROPERTY 2: Camden Loft (prop-002)
The problem property showing clear decline - THIS IS THE SHOWCASE
- 15 reviews spread July-December 2024
- Shows decline: Aug 8.5 avg down to Dec 6.2 avg
- Distribution: Jul-Aug 3 reviews good, Sep 2 declining, Oct 3 worse, Nov 4 critical, Dec 3 ongoing problems
- Channels: Airbnb 7 reviews (more forgiving ~7.5 avg), Booking.com 6 (more critical ~5.8 avg), Expedia 2
- Category decline especially cleanliness: Jul-Aug 8-9, Sep-Oct 6-7, Nov-Dec 3-5
- Include 5-6 reviews with cleanliness rating below 5
- Review texts MUST include these negative keywords appearing multiple times:
  * "dirty" appears 8 times total across reviews
  * "mold" or "moldy" appears 3 times
  * "bathroom" with "dirty" or "unclean" appears 4 times
  * "kitchen" with "dirty" or "unclean" appears 3 times
  * "not worth" or "overpriced" appears 3 times for value complaints
- Mix critical reviews (rating less than 6) with moderate (6-7)
- Review IDs: 2001-2015

PROPERTY 3: Brixton Apartment (prop-003)
Channel mismatch showing different guest expectations
- 12 reviews spread July-December 2024
- Overall avg around 7.8 but polarized by channel
- Distribution: 2 reviews per month
- Channels show distinct patterns:
  * Airbnb 6 reviews: avg 8.9, positive sentiment
  * Booking.com 4 reviews: avg 6.8, value complaints
  * Expedia 2 reviews: avg 6.2, size complaints
- Airbnb reviews include keywords: charming, authentic, local vibe, great location
- Airbnb categories mostly 9-10
- Booking.com and Expedia reviews include: expensive, small, tiny, not as described, misleading photos
- Booking.com and Expedia value ratings: 4-6
- Other categories for Booking/Expedia: 7-8 (decent)
- Review IDs: 3001-3012

REVIEW OBJECT STRUCTURE (every review must have exactly these fields):
- id: unique number
- type: "guest-to-host"
- status: "published"
- rating: null
- publicReview: string 1-4 sentences with specific keywords for sentiment
- reviewCategory: array of exactly 4 objects:
  * {category: "cleanliness", rating: number}
  * {category: "communication", rating: number}
  * {category: "location", rating: number}
  * {category: "value", rating: number}
- channelId: 2018 for Airbnb, 2005 for Booking.com, 2007 for Expedia
- submittedAt: ISO 8601 format YYYY-MM-DDTHH:mm:ssZ with realistic spread across months and varied times
- guestName: "FirstName L." format
- listingName: exact property name

CRITICAL REQUIREMENTS:
- Review texts varied and realistic, not repetitive
- Negative reviews specific: "bathroom had mold" not just "dirty"
- Positive reviews specific: "location perfect for restaurants" not just "good location"
- Dates spread naturally across months
- Guest names diverse
- Channel distribution realistic (Airbnb dominant)
- Camden Loft MUST show declining trend with cleanliness complaints
- Brixton Apartment MUST show channel polarization
- Total exactly 39 reviews: 12 plus 15 plus 12

This data demonstrates:
- Trend analysis (Camden decline)
- Sentiment analysis (keyword extraction)
- Category performance issues (cleanliness)
- Channel comparison (Brixton mismatch)
- Critical reviews (Camden has several)
- Action items generation (patterns emerge)

Verify:
- JSON is valid with correct Hostaway API structure
- Top level has status, result, count, offset fields
- result array contains exactly 39 review objects
- reviewsStore.ts correctly groups reviews by listingName
- Run npm run build to verify TypeScript compilation
```

---

## Phase 7: Shared Components

### Prompt for Claude Code:

```
Create reusable UI components:

1. Create components/shared/ReviewCard.tsx:

   This is a client component (use 'use client' directive) with interactive features

   Props:
   - review: NormalizedReview
   - mode: 'dashboard' or 'public'
   - onApprovalToggle: optional function taking id number and approved boolean

   Import Mantine components: Card, Badge, Group, Text, Switch, Stack

   Use Card as container with shadow sm, padding lg, and withBorder
   Use Stack for vertical layout with gap md

   Header section is a Group with justify space-between:
   - Left side shows guest name (Text with fontWeight 600 and size lg) and date plus channel (Text size sm, color dimmed, formatted as "Dec 20, 2024 • Airbnb")
   - Right side shows rating badge with color based on rating (red if less than 7, yellow if less than 8, green otherwise) formatted as "⭐ X.X"
   - If mode is dashboard, also show Switch component checked based on review.approved, onChange calls onApprovalToggle with review id and new value, label shows "Approved" or "Pending" based on state, color green

   Body section shows full publicReview text with size sm and lineHeight 1.6

   Footer section is Group with gap xs showing category badges:
   - Map through review.categories
   - Each Badge has variant outline, size sm, color based on rating (same logic as rating badge)
   - Text format: "category name: rating" with underscores replaced by spaces

   Create helper functions inside component:
   - getRatingColor taking rating number returning color string
   - getCategoryColor taking rating number returning color string

   Export ReviewCard

2. Create components/shared/StatCard.tsx:

   This is a server component

   Props:
   - title: string
   - value: string or number
   - delta: optional number
   - description: optional string

   Import Mantine components: Card, Text, Badge, Group, Stack
   Import icons: IconArrowUp, IconArrowDown, IconMinus

   Use Card as container with shadow sm, padding lg, withBorder
   Use Stack with gap xs

   Show title as Text with size sm, color dimmed, text transform uppercase, fontWeight 700

   Group with align baseline and gap sm containing:
   - Value as Text with size xl and fontWeight 700
   - If delta provided and not zero, Badge showing delta with:
     * Color green if positive, red if negative, gray if zero
     * Icon up arrow if positive, down arrow if negative, minus if zero
     * Text formatted as "+X.X" or "-X.X" to 1 decimal
     * variant light, size sm

   If description provided, show as Text with size xs and color dimmed

   Create helper functions:
   - getDeltaColor returning color based on delta sign
   - getDeltaIcon returning appropriate icon component

   Export StatCard

Verify:
- Run npm run build
- Check TypeScript errors
- Test by temporarily rendering StatCard in app/page.tsx
- Verify displays correctly
- Revert test after verification
```

---

## Phase 8: Dashboard Components (Part 1)

### Prompt for Claude Code:

```
IMPORTANT: Before creating components, create shared utilities following DRY principles.

0. Create lib/utils/helpers.ts:

   Shared utility functions for repeated logic across components

   Export getRatingColor function:
   - Takes rating number (0-10)
   - Returns 'red' if less than 7, 'yellow' if less than 8, 'green' otherwise

   Export getStatusColor function:
   - Takes status: 'critical' | 'warning' | 'good'
   - Returns corresponding Mantine color string

   Export getStatusIcon function:
   - Takes status string
   - Returns emoji: '🔴' for critical, '⚠️' for warning, '✅' for good

   Export calculateAverage function:
   - Takes number array
   - Returns average rounded to 1 decimal, or 0 if empty

   Export formatCategoryName function:
   - Takes category string
   - Replaces underscores with spaces and capitalizes

   Export getDeltaColor function:
   - Takes delta number
   - Returns 'green' if positive, 'red' if negative, 'gray' if zero

   Export formatDelta function:
   - Takes delta number
   - Returns formatted string with sign ("+X.X" or "-X.X")

Create first 3 dashboard components:

1. Create components/dashboard/PropertySelector.tsx:

   SCALABILITY: Uses Select dropdown instead of Tabs for better scalability with 100+ properties

   Client component with 'use client' directive

   Props:
   - properties: PropertyReviews array
   - selectedId: string
   - onSelect: function taking id string

   Import Mantine Select, Badge, Group, Text
   Import calculateAverage and getRatingColor from lib/utils/helpers
   Import useMemo from react

   Use useMemo to calculate selectData from properties:
   - Map each property to object with value (propertyId), label (propertyName), and avgRating
   - Calculate avgRating using calculateAverage helper with review ratings

   Render Select component:
   - label "Select Property"
   - placeholder "Choose a property"
   - data mapped from selectData (value and label only)
   - value as selectedId
   - onChange calls onSelect (check for null)
   - searchable true (scales to 100+ properties)
   - clearable false
   - size md
   - Styled with fontWeight 500 for input

   Below Select, show current rating if selectedProperty exists:
   - Group with gap xs, margin top sm
   - Text "Current Rating:" size sm, color dimmed
   - Badge with getRatingColor based on avgRating, size lg, showing "⭐ X.X"

   Export PropertySelector

2. Create components/dashboard/StatsOverview.tsx:

   Server component

   Props: metrics: PropertyMetrics

   Import Mantine SimpleGrid
   Import StatCard component

   Use SimpleGrid with cols base 1, sm 3, and spacing lg

   Contains three StatCard components:

   First card:
   - title: "Average Rating"
   - value: metrics.avgRating formatted to 1 decimal
   - delta: metrics.ratingDelta
   - description: "vs last 30 days"

   Second card:
   - title: "Total Reviews"
   - value: metrics.totalReviews
   - description: "Across all channels"

   Third card:
   - title: "Public Reviews"
   - value: metrics.approvedReviews
   - description: Calculate approval percentage as (approvedReviews divided by totalReviews times 100) rounded, format as "(X% approval rate)", handle zero totalReviews

   Export StatsOverview

3. Create components/dashboard/CategoryPerformance.tsx:

   Server component

   Props: categoryPerformance: CategoryPerformance array

   Import Mantine Card, Stack, Group, Text, Progress, Badge
   Import icons IconArrowUp, IconArrowDown, IconMinus
   Import getStatusColor, getDeltaColor, formatDelta, formatCategoryName from lib/utils/helpers

   Use Card container with shadow sm, padding lg, withBorder
   Title "Category Performance" as Text size lg, fontWeight 700, margin bottom md
   Stack with gap md

   Sort categories by avgRating ascending (worst first)

   For each category create div containing:

   First row is Group with justify space-between, margin bottom xs:
   - Left: category name as Text size sm, fontWeight 500, text transform capitalize
   - Use formatCategoryName helper for category display
   - Right: Group with gap xs containing:
     * Rating number as Text size sm, fontWeight 600, formatted to 1 decimal
     * If delta30d not zero, Badge with:
       - Color from getDeltaColor helper
       - Icon component based on delta (create getDeltaIcon helper returning icon component)
       - Text from formatDelta helper
       - leftSection with DeltaIcon size 12
       - variant light, size sm

   Second row is Progress component with:
   - value as (avgRating divided by 10 times 100)
   - color from getStatusColor helper using category.status
   - size md

   Create local helper getDeltaIcon function:
   - Takes delta number
   - Returns IconArrowUp if positive, IconArrowDown if negative, IconMinus if zero

   Export CategoryPerformance

Verify:
- Run npm run build
- Check TypeScript errors
```

---

## Phase 8: Dashboard Components (Part 2)

### Prompt for Claude Code:

```
Create next 3 dashboard components:

4. Create components/dashboard/TrendChart.tsx:

   Client component with 'use client' directive (charts are interactive)

   Props: trendData: TrendDataPoint array

   Import Mantine Card and Text
   Import LineChart from @mantine/charts

   Use Card container with shadow sm, padding lg, withBorder
   Title "Rating Trend (Last 6 Months)" as Text size lg, fontWeight 700, margin bottom md

   Filter trendData to only months with count greater than 0, store as validData

   If validData length is 0:
   - Show Text with color dimmed: "Not enough data for trend chart"
   - Don't render chart

   Otherwise render LineChart with:
   - h as 300
   - data as validData
   - dataKey as "month"
   - series array with 5 objects (ALL 4 CATEGORIES plus overall):
     * name avgRating, label Overall, color blue
     * name cleanliness, label Cleanliness, color teal
     * name communication, label Communication, color violet
     * name location, label Location, color green
     * name value, label Value, color orange
   - curveType as "monotone"
   - withLegend true
   - withTooltip true
   - withDots false
   - yAxisProps with domain array [0, 10]

   Export TrendChart

5. Create components/dashboard/SentimentDisplay.tsx:

   SCALABILITY: Limits keywords to top 10 to prevent overflow with large datasets

   Server component

   Props: sentiment: SentimentData

   Import Mantine Card, Grid, Text, Badge, Stack, Alert, List

   Define constant MAX_KEYWORDS_DISPLAY = 10

   Slice sentiment data to top keywords:
   - topNegative = sentiment.negative.slice(0, MAX_KEYWORDS_DISPLAY)
   - topPositive = sentiment.positive.slice(0, MAX_KEYWORDS_DISPLAY)

   Use Stack with gap md

   First section is Card with shadow sm, padding lg, withBorder:
   - Title "Guest Sentiment Analysis" as Text size lg, fontWeight 700, margin bottom md
   - Grid with two columns

   Left column (Grid.Col span base 12, sm 6):
   - Stack with gap xs
   - Header "🔴 Negative (Rating < 7)" as Text fontWeight 600, color red
   - If topNegative length greater than 0:
     * Stack with gap xs
     * Map through topNegative creating Badge for each:
       - color red
       - variant light
       - size lg
       - style textTransform 'none'
       - text as "keyword.phrase (keyword.count)"
   - Else show "No negative patterns detected" as Text size sm, color dimmed

   Right column (Grid.Col span base 12, sm 6):
   - Stack with gap xs
   - Header "🟢 Positive (Rating > 8)" as Text fontWeight 600, color green
   - If topPositive length greater than 0:
     * Stack with gap xs
     * Map through topPositive creating Badge for each:
       - color green
       - variant light
       - size lg
       - style textTransform 'none'
       - text as "keyword.phrase (keyword.count)"
   - Else show "No positive patterns detected" as Text size sm, color dimmed

   Second section (only if sentiment.actionItems length greater than 0):
   - Alert with title "🎯 Action Items" and color yellow
   - List inside Alert with size sm
   - Map through actionItems creating List.Item for each

   Export SentimentDisplay

6. Create components/dashboard/ChannelStats.tsx:

   Server component

   Props: channelStats: ChannelStats array

   Import Mantine Card, Stack, Group, Text, Badge
   Import getStatusIcon and getStatusColor from lib/utils/helpers

   Use Card container with shadow sm, padding lg, withBorder
   Title "Performance by Channel" as Text size lg, fontWeight 700, margin bottom md
   Stack with gap md

   Data is already sorted by rating descending

   For each channel create Group with justify space-between:
   - Left: channel name as Text with fontWeight 500
   - Right: Group with gap xs containing:
     * Status icon from getStatusIcon helper
     * Rating badge with:
       - color from getStatusColor helper
       - variant light
       - text as "X.X avg" formatted to 1 decimal
     * Review count as Text size sm, color dimmed, format "(X reviews)"

   Export ChannelStats

Verify:
- Run npm run build
- Check TypeScript errors
```

---

## Phase 8: Dashboard Components (Part 3)

### Prompt for Claude Code:

```
Create final 3 dashboard components:

7. Create components/dashboard/CriticalIssues.tsx:

   Client component with 'use client' directive (has interactive buttons and modal)

   Props:
   - criticalReviews: CriticalReview array
   - onApprovalToggle: function taking id number and approved boolean

   Import useState from react
   Import Mantine Card, Stack, Group, Text, Badge, Button, Modal
   Import formatDate from lib/utils/dateHelpers
   Import formatCategoryName from lib/utils/helpers

   State management:
   - selectedReview: CriticalReview | null (for modal)

   Use Card container with shadow sm, padding lg, withBorder
   Title "🚨 Critical Issues (Last 30 Days)" as Text size lg, fontWeight 700, margin bottom md

   If criticalReviews length is 0:
   - Show success message as Text color green, size sm: "✅ No critical issues in the last 30 days"
   - Return early, don't render cards

   Otherwise show Stack with gap md:
   - Map through criticalReviews (already limited to 5)
   - For each review create Card with withBorder and padding md containing:

     Header Group with justify space-between, margin bottom xs:
     - Left: Group with gap xs:
       * Severity badge showing "🔴" if rating less than 5 or worstCategory.rating less than 4, else "⚠️"
       * Badge text "Critical" or "Warning"
       * Badge color red or yellow
       * Channel badge with variant outline
     - Right: date as Text size sm, color dimmed, formatted with formatDate

     Guest info: guest name as Text size sm, color dimmed

     Problem highlight as Group gap xs, margin bottom xs:
     - Badge showing worst category with:
       * color red
       * variant light
       * text as "category: rating/10" using formatCategoryName helper

     Review excerpt as Text size sm showing first 100 chars, add "..." if excerpt shorter than full review

     Action buttons as Group margin top md, gap xs:
     - Button "View Full" with size xs, variant outline, onClick sets selectedReview to current review
     - Button "Approve" with size xs, color green, onclick calls onApprovalToggle with review.id and true, disabled if already approved
     - Button "Reject" with size xs, color red, onclick calls onApprovalToggle with review.id and false, disabled if already not approved

   Modal component (after Stack):
   - opened when selectedReview is not null
   - onClose sets selectedReview to null
   - title "Full Review Details"
   - size lg
   - Content (if selectedReview exists):
     * Stack with gap md showing:
       - Group with guest name (Text fw 600), date and channel (Text size sm, color dimmed), and rating badge
       - Worst category section with label and Badge
       - Full review text with label and content (lineHeight 1.6)

   Export CriticalIssues

8. Create components/dashboard/FilterBar.tsx:

   SCALABILITY: Uses searchable MultiSelect components that scale to 100+ options

   Client component with 'use client' directive

   Props:
   - filters: FilterState
   - onFilterChange: function taking partial FilterState
   - onClearFilters: function

   Import Mantine Group, MultiSelect, Button, Stack, Text
   Import DatePickerInput from @mantine/dates
   Import RangeSlider from @mantine/core
   Import FilterState from lib/store/dashboardStore
   Import getAllChannels from lib/utils/channelMapping

   Define CATEGORY_OPTIONS constant array with objects:
   - value cleanliness, label Cleanliness
   - value communication, label Communication
   - value location, label Location
   - value value, label Value

   Use Stack with gap md as container

   First Group with gap md and wrap containing:

   Channel MultiSelect:
   - label "Channels"
   - placeholder "All channels"
   - data from getAllChannels mapped to {value: String(id), label: name}
   - value as filters.channels
   - onChange calls onFilterChange with {channels: value}
   - clearable and searchable true (scales to 100+ channels)
   - style minWidth 200

   Category MultiSelect:
   - label "Categories"
   - placeholder "All categories"
   - data as CATEGORY_OPTIONS
   - value as filters.categories
   - onChange calls onFilterChange with {categories: value}
   - clearable and searchable true
   - style minWidth 200

   Date Range Picker:
   - type "range"
   - label "Date Range"
   - placeholder "Pick dates"
   - value as filters.dateRange
   - onChange calls onFilterChange with {dateRange: value}
   - clearable
   - style minWidth 250

   Rating Range Slider section (separate div):
   - Group with justify space-between, margin bottom xs:
     * Text "Rating Range" size sm, fontWeight 500
     * Text showing current range size sm, color dimmed formatted as "X.X - X.X"
   - RangeSlider:
     * min 1, max 10, step 0.5, minRange 0.5
     * value as filters.ratingRange
     * onChange calls onFilterChange with {ratingRange: value as [number, number]}
     * marks: value 1 label "1", value 5 label "5", value 10 label "10"

   Clear Filters Button:
   - variant subtle
   - color gray
   - onClick calls onClearFilters
   - size sm
   - text "Clear Filters"

   Export FilterBar

9. Create components/dashboard/SortControls.tsx:

   Client component with 'use client' directive

   Props:
   - sortBy: 'date' or 'rating' or 'channel'
   - sortOrder: 'asc' or 'desc'
   - onSortChange: function taking by and order strings

   Import Mantine Group, Select, Button, Text
   Import icons IconArrowUp and IconArrowDown

   Define SORT_OPTIONS constant array with objects:
   - value date, label Date
   - value rating, label Rating
   - value channel, label Channel

   Use Group with gap md

   Label as Text: "Sort by:" with fontWeight 500

   Sort Field Select:
   - data as SORT_OPTIONS
   - value as sortBy
   - onChange calls onSortChange with new value and current sortOrder (check for null)
   - style width 150
   - no label prop

   Sort Order Toggle Button:
   - variant subtle
   - onClick toggles sortOrder (asc to desc, desc to asc) and calls onSortChange
   - leftSection shows IconArrowUp if sortOrder is asc, IconArrowDown if desc (size 16)
   - Text shows "Ascending" if asc, "Descending" if desc
   - aria-label "Toggle sort order"

   Create toggleSortOrder helper function:
   - Determines newOrder based on current sortOrder
   - Calls onSortChange with sortBy and newOrder

   Export SortControls

Verify:
- Run npm run build
- Check TypeScript errors
- All 9 dashboard components complete (PropertySelector, StatsOverview, CategoryPerformance, TrendChart, SentimentDisplay, ChannelStats, CriticalIssues, FilterBar, SortControls)
```

---

## Phase 9: Dashboard Page

### Prompt for Claude Code:

```
Create the main dashboard page at app/dashboard/page.tsx:

IMPORTANT: This is a client component (use 'use client' directive) because it's interactive

Import all 9 dashboard components created in Phase 8
Import ReviewCard from shared components
Import hooks: useState and useEffect from react
Import useDashboardStore from Zustand store
Import Mantine Container, Stack, Title, Text, LoadingOverlay, SimpleGrid
Import calculatePropertyMetrics from analytics
Import PropertyMetrics type

Use Zustand store for:
- selectedPropertyId
- reviews
- filters
- sortBy and sortOrder
- Actions: setSelectedProperty, setReviews, setFilters, setSorting, clearFilters
- Computed selector: getFilteredReviews

Local state:
- properties: PropertyReviews array
- metrics: PropertyMetrics or null
- loading: boolean

Data Fetching useEffect (dependency array empty, runs on mount):
- Set loading true
- Fetch from GET /api/reviews/hostaway
- Parse response and group reviews by propertyId into PropertyReviews array
- Store in properties state
- Set first property as selected by calling setSelectedProperty with 'prop-001'
- Set loading false
- Handle errors appropriately

When selectedPropertyId changes useEffect (dependency array [selectedPropertyId]):
- Find selected property in properties array
- If found:
  * Call setReviews with that property's reviews
  * Calculate metrics using calculatePropertyMetrics on reviews
  * Store metrics in state

Event Handlers:

handlePropertySelect function taking propertyId string:
- Calls setSelectedProperty with propertyId

handleApprovalToggle function taking reviewId number and approved boolean:
- Optimistically update review in local state
- Call POST /api/reviews/[reviewId]/approve with body {approved}
- If API fails, revert local state
- Recalculate metrics after update

handleFilterChange function taking partial FilterState:
- Calls setFilters with new filters

handleSortChange function taking by and order strings:
- Calls setSorting with by and order

Layout inside Container size xl, padding y xl:

Stack with gap xl containing:

Page header div:
- Title order 1: "Reviews Dashboard"
- Text color dimmed, size sm: "Manage and analyze property reviews"

LoadingOverlay with visible based on loading state

If not loading and properties length greater than 0:
- PropertySelector with properties, selectedId, and onSelect

If metrics exists: StatsOverview with metrics

If metrics and categoryPerformance length greater than 0: CategoryPerformance with categoryPerformance

If metrics exists: TrendChart with trendData

If metrics exists: SentimentDisplay with sentiment

If metrics and channelStats length greater than 0: ChannelStats with channelStats

If metrics exists: CriticalIssues with criticalReviews and onApprovalToggle

FilterBar with filters, onFilterChange, and onClearFilters

SortControls with sortBy, sortOrder, and onSortChange

Reviews section div:
- Title order 3, margin bottom md: "All Reviews ({count} reviews)" where count is getFilteredReviews length
- SimpleGrid with cols base 1, md 2, spacing lg
- Map through getFilteredReviews creating ReviewCard for each with:
  * key as review.id
  * review prop
  * mode as "dashboard"
  * onApprovalToggle handler
- If getFilteredReviews length is 0, show Text color dimmed, text align center, padding y xl: "No reviews match current filters"

Error handling:
- Wrap API calls in try-catch
- Show error message if fetch fails
- Log errors to console

Verify:
- Dashboard protected by middleware (redirects to login if not authenticated)
- All sections render
- Property tabs switch between properties
- Filters update review list
- Approval toggle updates state
- No console errors
```

---

## Phase 10: Property Images & Details Data Layer

### Prompt for Claude Code:

```
Create property images and details data layer using Unsplash for high-quality images:

1. Create lib/data/propertyImages.ts:

   IMPORTANT: Uses Unsplash Source API for zero-storage image solution
   Benefits: No image files in repo, CDN-hosted, high quality, unique per property

   Define PropertyImage interface:
   - id: string
   - url: string
   - alt: string

   Define PropertyImagesData interface:
   - propertyId: string
   - images: PropertyImage array

   Constants:
   - IMAGE_WIDTH: 1200
   - IMAGE_HEIGHT: 800

   Create PROPERTY_MAP constant Record<string, PropertyImage[]>:

   prop-001 (Shoreditch Heights Studio) has 3 images:
   - Image 1: Unsplash URL with keywords "apartment,modern,interior,shoreditch1", alt "Modern Living Space"
   - Image 2: Unsplash URL with keywords "studio,apartment,kitchen,shoreditch2", alt "Kitchen Area"
   - Image 3: Unsplash URL with keywords "bedroom,modern,apartment,shoreditch3", alt "Bedroom"

   prop-002 (Camden Loft) has 3 images:
   - Image 1: Unsplash URL with keywords "loft,apartment,living,camden1", alt "Spacious Loft Living"
   - Image 2: Unsplash URL with keywords "loft,interior,modern,camden2", alt "Modern Interior"
   - Image 3: Unsplash URL with keywords "apartment,bathroom,luxury,camden3", alt "Bathroom"

   prop-003 (Brixton Apartment) has 3 images:
   - Image 1: Unsplash URL with keywords "apartment,cozy,living,brixton1", alt "Cozy Living Room"
   - Image 2: Unsplash URL with keywords "apartment,dining,modern,brixton2", alt "Dining Area"
   - Image 3: Unsplash URL with keywords "bedroom,apartment,comfortable,brixton3", alt "Comfortable Bedroom"

   Format: `https://source.unsplash.com/${width}x${height}/?${keywords}`
   Note: Seed keywords ensure consistent images per property

   Export getPropertyImages function taking propertyId returning PropertyImage array
   Export getAllPropertyImages function returning PropertyImagesData array

2. Create lib/data/propertyDetails.ts:

   Define PropertyAmenity interface:
   - icon: string (emoji)
   - name: string

   Define PropertyDetails interface:
   - propertyId: string
   - propertyName: string
   - description: string (2-3 paragraphs)
   - pricePerNight: number
   - pricePerMonth: number (with discount applied)
   - monthlyDiscount: number (e.g., 0.2 for 20%)
   - cleaningFee: number
   - capacity object with: guests, bedrooms, beds, bathrooms (all numbers)
   - minimumStay: number
   - amenities: PropertyAmenity array (12+ items with emoji icons)
   - policies object with: checkIn, checkOut, cancellation strings, houseRules string array

   Create PROPERTY_DETAILS constant Record<string, PropertyDetails>:

   prop-001 (Shoreditch Heights Studio):
   - Description: Modern studio in trendy Shoreditch, high ceilings, natural light
   - Price: £185/night, £4440/month (20% discount)
   - Cleaning: £60
   - Capacity: 2 guests, 1 bedroom, 1 bed, 1 bathroom
   - Min stay: 7 nights
   - Amenities: High-Speed WiFi 📶, Full Kitchen 🍳, Washing Machine 🧺, Smart TV 📺, AC 💨, Heating 🔥, Hair Dryer 🛁, Toiletries 🧴, Workspace 🏢, Self Check-In 🔒, Coffee Machine ☕, Dishware 🍽️
   - Policies: Check-in after 3 PM, check-out before 11 AM, free cancellation 7 days before

   prop-002 (Camden Loft):
   - Description: Industrial-chic loft in Camden, exposed brick, character + comfort. Note maintenance issues being addressed
   - Price: £220/night, £5280/month (20% discount)
   - Cleaning: £80
   - Capacity: 4 guests, 2 bedrooms, 2 beds, 1 bathroom
   - Min stay: 14 nights
   - Amenities: WiFi 📶 (note recent connectivity issues in reviews), Kitchen 🍳, Washer/Dryer 🧺, TV 📺, Heating 🔥, Bathtub 🛁, Desk 🏢, Keypad 🔒, Coffee ☕, Essentials 🍽️, Cleaning Supplies 🧹, Iron 👔
   - Policies: Check-in after 4 PM, check-out before 10 AM, free cancellation 14 days before

   prop-003 (Brixton Apartment):
   - Description: Charming apartment in multicultural Brixton, authentic London, local character
   - Price: £165/night, £3960/month (20% discount)
   - Cleaning: £55
   - Capacity: 3 guests, 1 bedroom, 2 beds, 1 bathroom
   - Min stay: 10 nights
   - Amenities: WiFi 📶, Kitchen 🍳, Washing Machine 🧺, TV 📺, Heating 🔥, Shower 🛁, Fan 💨, Lockbox 🔒, Tea & Coffee ☕, Cookware 🍽️, Toiletries 🧴, Hangers 👔
   - Policies: Check-in after 3 PM, check-out before 11 AM, free cancellation 10 days before

   Export getPropertyDetails function taking propertyId returning PropertyDetails or undefined
   Export getAllPropertyDetails function returning PropertyDetails array

Verify:
- Run npm run build
- Check TypeScript compilation
- All types defined correctly
```

---

## Phase 11: Property Page Components

### Prompt for Claude Code:

```
Create components for public property detail page matching Flex Living design from https://theflex.global/property/163276:

1. Create components/property/ImageGallery.tsx:

   Client component with 'use client' directive (interactive carousel)

   Props:
   - images: PropertyImage array
   - propertyName: string

   Import useState from react
   Import Mantine Stack, Image, Group, ActionIcon, Box, Text
   Import icons IconChevronLeft, IconChevronRight

   Local state: selectedIndex number (default 0)

   If images empty, show placeholder Box with gray background, height 400, centered text "No images available"

   Main image display:
   - Box with position relative
   - Image component with current image URL, alt, radius md, height 500, fit cover, box shadow
   - Left/right navigation ActionIcons positioned absolute (only if multiple images):
     * Left: absolute left 16, top 50%, transform translateY(-50%), onClick handlePrevious
     * Right: absolute right 16, top 50%, transform translateY(-50%), onClick handleNext
     * Both: size lg, radius xl, variant filled, color dark
   - Image counter badge positioned absolute bottom 16, right 16, showing "X / Y", dark background with opacity

   Thumbnail navigation (only if multiple images):
   - Group with gap sm, justify center
   - Map through all images creating clickable thumbnail Boxes
   - Each thumbnail: width 100, height 75, fit cover
   - Selected thumbnail has 3px teal border (#284E4C), scale 1.05, opacity 1
   - Unselected thumbnails have transparent border, scale 1, opacity 0.6
   - Smooth transitions on all transform/opacity changes

   handlePrevious: sets index to last if at 0, else decrements
   handleNext: sets index to 0 if at last, else increments

   Export ImageGallery

2. Create components/property/PropertyInfo.tsx:

   Server component

   Props: details: PropertyDetails

   Import Mantine Stack, Title, Text, Grid, Card, Group, Badge, List, Box

   Use Stack with gap xl for main container

   Section 1 - Quick Stats Card:
   - Card withBorder, padding lg, radius md
   - Grid with 6 columns (responsive: base 4, xs 4)
   - Display: Guests, Bedrooms, Beds, Bathrooms, Min. Nights, Price/Night
   - Each stat: center-aligned Box with large number (size xl, fw 700) and dimmed label below

   Section 2 - Description:
   - Title "About This Property" (order 2, size h3, margin bottom md)
   - Text with lineHeight 1.7, color dark, showing full description

   Section 3 - Amenities:
   - Title "Amenities" (order 2, size h3, margin bottom md)
   - Grid with responsive columns (base 6, sm 4, md 3)
   - Map amenities as Group with gap xs: emoji icon (size xl) + name (size sm)

   Section 4 - Location:
   - Title "Location" (order 2, size h3, margin bottom md)
   - Map Placeholder Box (matching Flex Living design):
     * Box with width 100%, height 300
     * Background color #f5f5f5, border 1px solid #e0e0e0, border radius 8
     * Display flex, align/justify center, position relative, overflow hidden
     * Background grid pattern using linear-gradient (20px grid for map-like appearance)
     * Centered content with large 📍 emoji (size 4rem)
     * Property name as Text size sm, fw 600 below pin
     * Small note "Interactive map in production" (size xs, color dimmed)

   Section 5 - Stay Policies:
   - Title "Stay Policies" (order 2, size h3, margin bottom md)
   - Card withBorder, padding lg, radius md
   - Stack showing: Check-in time, Check-out time, Cleaning fee, Cancellation policy, House rules list
   - Format as Groups with label (fw 600) and value (color dimmed)
   - House rules as List with items

   Export PropertyInfo

3. Create components/property/BookingPanel.tsx:

   Client component with 'use client' directive (PRESENTATIONAL ONLY - non-functional)

   Props: details: PropertyDetails

   Import Mantine Card, Stack, Text, Button, Group, NumberInput, Box, Divider
   Import DatePickerInput from @mantine/dates
   Import useState

   Local state:
   - guests: number (default 1)
   - dateRange: [Date | null, Date | null] (default [null, null])

   Card container: withBorder, padding lg, radius md, shadow md, sticky position (top 20)

   Pricing header:
   - Large price "£X / night" (size xl, fw 700)
   - Monthly price below with discount badge

   Divider

   Booking form (non-functional):
   - DatePickerInput type range, label "Select Dates", clearable, minDate today
   - NumberInput for guests (min 1, max capacity.guests)
   - Button "Book Your Stay (Demo)" fullWidth, size md, disabled, cursor not-allowed
   - Small text below: "Booking functionality not available in demo"

   If dates selected, show price breakdown:
   - Calculate nights between dates
   - Show: "£X × Y nights = £Z"
   - Show: "Cleaning fee = £X"
   - Divider
   - Show: "Total = £Z" (fw 700, size lg)

   Export BookingPanel

4. Create components/property/PropertyHeader.tsx:

   Server component

   Props:
   - propertyName: string
   - avgRating: number
   - totalReviews: number

   Import Mantine Stack, Title, Text, Badge, Group

   Use Stack with gap md

   Property name as Title order 1, size h2 (large and prominent)

   Rating display as Group with gap sm:
   - Large rating badge with size xl, color yellow or gold theme, text "⭐ X.X" formatted to 1 decimal
   - Review count as Text color dimmed, format "Based on X reviews"

   Clean minimal design with generous spacing matching Flex Living professional aesthetic

   Export PropertyHeader

2. Create components/property/ReviewsSection.tsx:

   Client component with 'use client' directive (for sort functionality)

   Props: reviews: NormalizedReview array

   Import Mantine Stack, Title, Text, SimpleGrid, Select, Group, Badge
   Import ReviewCard component
   Import useState from react

   Local state: sortBy as 'recent' or 'highest'

   Use Stack with gap lg

   Section header:
   - Title order 2: "Guest Reviews"
   - Group with justify space-between, align center:

     Left side stats summary:
     - Calculate overall average rating
     - Show category averages as small badges:
       * Map through unique categories
       * Calculate average for each
       * Badge variant light, size sm
       * Format "Category: X.X"

     Right side sort control:
     - Select dropdown with:
       * data array: value 'recent' label 'Most Recent', value 'highest' label 'Highest Rated'
       * value as sortBy
       * onChange updates sortBy state

   If reviews length is 0:
   - Show Text color dimmed, text align center, padding y xl: "No reviews yet for this property"
   - Return early

   Reviews grid:
   - Sort reviews based on sortBy: 'recent' sorts by submittedAt descending, 'highest' sorts by rating descending
   - SimpleGrid with cols base 1, md 2, lg 3
   - Map through sorted reviews creating ReviewCard with:
     * mode as 'public'
     * no onApprovalToggle (read-only)

   Export ReviewsSection

3. Create components/property/PropertyPageLayout.tsx:

   Server component

   Props: children ReactNode

   Import Mantine Container, Stack, Group, Text

   IMPORTANT: This provides Flex Living page context with header and footer
   Header and footer are PRESENTATIONAL ONLY (non-functional)
   Only reviews section is functional

   Structure as div with minHeight 100vh, display flex, flexDirection column:

   Header element with borderBottom 1px solid #e0e0e0, padding 1rem 0:
   - Container size xl
   - Group justify space-between:
     * Logo as Text size xl, fontWeight 700, color blue: "Flex Living"
     * Nav links as Group gap lg with non-functional links (cursor default):
       - Text size sm, color dimmed: "Home"
       - Text size sm, color dimmed: "Properties"
       - Text size sm, color dimmed: "Contact"

   Main element with flex 1:
   - Contains children prop

   Footer element with borderTop 1px solid #e0e0e0, padding 2rem 0, marginTop auto:
   - Container size xl
   - Stack gap md:

     Group justify space-between:
     - Contact div:
       * Text size sm, fontWeight 600, margin bottom xs: "Contact"
       * Text size sm, color dimmed: "hello@theflex.global"
     - Quick Links div:
       * Text size sm, fontWeight 600, margin bottom xs: "Quick Links"
       * Stack gap xs with non-functional links:
         - Text size sm, color dimmed, cursor default: "About Us"
         - Text size sm, color dimmed, cursor default: "FAQ"

     Copyright as Text size xs, color dimmed, text align center: "© {current year} Flex Living. Assessment project."

   Clean minimal design with neutral colors, simple borders, adequate spacing
   Matches Flex Living professional aesthetic

   Export PropertyPageLayout

Verify:
- Run npm run build
- Check TypeScript errors
```

---

## Phase 12: Property Detail Page

### Prompt for Claude Code:

```
Create public property detail page at app/property/[id]/page.tsx:

CRITICAL DESIGN REFERENCE: Matches two-column layout from https://theflex.global/property/163276
- Desktop: Two columns (left: images + info, right: booking panel sticky)
- Mobile: Single column stacked layout
- Professional Flex Living aesthetic with clean spacing

Server component (fetches data server-side)

Dynamic route with propertyId param extracted from params object with id property

Import all components:
- PropertyPageLayout, PropertyHeader, ReviewsSection, ImageGallery, PropertyInfo, BookingPanel
- Mantine Container, Stack, Text, Title, Button, Grid, Box
- Data functions: getPropertyImages, getPropertyDetails

Data Fetching (server-side):

Extract propertyId from params.id

Fetch approved reviews:
- Call GET endpoint /api/reviews/public/{propertyId}
- Use fetch with full URL constructed from:
  * process.env.NEXT_PUBLIC_BASE_URL (for Vercel deployment)
  * process.env.VERCEL_URL with https:// prefix (auto-set by Vercel)
  * http://localhost:3000 as fallback (for local development)
  * Example: const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
- Parse JSON response extracting success, propertyName, reviews, count

Get property data:
- Call getPropertyDetails(params.id) for property information
- Call getPropertyImages(params.id) for image gallery

Error handling:
- If response not ok or success false OR propertyDetails not found:
  * Return error page with PropertyPageLayout containing:
    - Container size xl, padding y xl
    - Stack gap md, align center, text align center, padding top 60
    - Title order 2: "Property Not Found"
    - Text color dimmed: "The property you're looking for doesn't exist or has been removed."
    - Button component anchor to "/" with variant outline: "Back to Home"

Calculate stats:
- avgRating as average of all review ratings formatted to 1 decimal (handle empty reviews array)
- totalReviews as reviews.count

Page structure inside PropertyPageLayout:

Container size xl, padding y xl:
  Stack gap xl:

    PropertyHeader with propertyName, avgRating, totalReviews

    Two-Column Grid (responsive):
    - Grid with gutter xl
    - Left column: Grid.Col span {{ base: 12, lg: 8 }}
      * Stack gap xl containing:
        - ImageGallery with images and propertyName
        - PropertyInfo with details
    - Right column: Grid.Col span {{ base: 12, lg: 4 }}
      * Box wrapper (sticky on desktop, normal on mobile)
      * BookingPanel with details

    Full-Width Reviews Section:
    - Box with margin top xl
    - ReviewsSection with reviews (MAIN FUNCTIONAL CONTENT)

Metadata (generated with generateMetadata):
- Title: "{propertyName} - Guest Reviews | Flex Living"
- Description: "Read {totalReviews} guest reviews for {propertyName}. Average rating: {avgRating}/10"
- Handle property not found case with appropriate title and description

Testing URLs:
- /property/prop-001 (Shoreditch Heights Studio - excellence baseline)
- /property/prop-002 (Camden Loft - declining trend with cleanliness issues)
- /property/prop-003 (Brixton Apartment - channel mismatch)
- /property/invalid (should show 404 error)

IMPORTANT NOTES:
- Only approved reviews shown (API filters)
- Page fully server-rendered (good for SEO)
- Fully responsive with Mantine Grid breakpoints
- Two-column desktop layout, stacked mobile layout
- Booking panel sticky on desktop only
- Layout provides Flex Living context with header and footer
- Images from Unsplash CDN (no local storage)
- All property details, amenities, policies displayed
- Design matches https://theflex.global/property/163276 aesthetic

Verify:
- Visit each property URL
- Desktop: two-column layout with sticky booking panel
- Mobile: stacked single-column layout
- Image gallery carousel works
- Approved reviews display correctly
- Unapproved reviews do NOT appear
- All property sections render (stats, description, amenities, location, policies)
- Test property with no approved reviews
- Test invalid property ID
- Responsive at all breakpoints
- No console errors
```

---

## Phase 13: Login Page

### Prompt for Claude Code:

```
Create login page at app/login/page.tsx:

Client component with 'use client' directive (interactive form)

Import Mantine Container, Card, Stack, TextInput, PasswordInput, Button, Title, Text, Alert
Import useAuthStore from Zustand
Import useState from react
Import useRouter from next/navigation
Import IconAlertCircle from @tabler/icons-react

Local state:
- email: string
- password: string
- error: string or null
- loading: boolean

handleSubmit event handler taking FormEvent:
- Prevent default
- Set loading true
- Clear error
- Call POST /api/auth/login with body JSON.stringify of email and password, header Content-Type application/json
- If response ok:
  * Call authStore.login
  * Router push to /dashboard
- If failed:
  * Parse error from response
  * Set error state
- Finally set loading false
- Wrap in try-catch for network errors

Layout inside Container size xs with minHeight 100vh, display flex, alignItems center:

Card shadow md, padding xl, width 100%:
- Stack gap lg:

  Header div:
  - Title order 2, text align center: "Manager Login"
  - Text color dimmed, size sm, text align center, margin top xs: "Access the reviews dashboard"

  If error exists, Alert with:
  - icon IconAlertCircle size 16
  - color red
  - title "Login Failed"
  - content showing error message

  Form with onSubmit handler:
  - Stack gap md:

    TextInput:
    - label "Email"
    - placeholder "manager@flex.com"
    - type email
    - required
    - value email
    - onChange updates email state
    - disabled when loading

    PasswordInput:
    - label "Password"
    - placeholder "Enter password"
    - required
    - value password
    - onChange updates password state
    - disabled when loading

    Button:
    - type submit
    - fullWidth
    - loading state from loading
    - margin top md
    - text "Sign In"

  Demo credentials hint as Text size xs, color dimmed, text align center, margin top lg:
  - "Demo credentials:"
  - "Email: manager@flex.com"
  - "Password: flex2024"

Clean minimal form with loading state and error visibility
Proper accessibility with labels and required indicators
Keyboard navigation works

Verify:
- Navigate to /login
- Form renders centered
- Can input email and password
- Valid credentials redirect to /dashboard
- Invalid credentials show error
- Loading state displays during submission
- No console errors
```

---

## Phase 14: Home Page & Dashboard Layout

### Prompt for Claude Code:

```
CRITICAL CLARIFICATION ON NAVIGATION FLOW:
- First page user sees: /login
- After login: /dashboard (NO header, NO footer, NO extra navigation - just dashboard content)
- From dashboard: Link to view public property page opens in NEW TAB
- Dashboard does NOT disappear when viewing property pages

1. Update app/page.tsx to redirect to login:

Server component

Import redirect from next/navigation

Function body simply calls: redirect('/login')

This ensures first page is always login

2. Create app/dashboard/layout.tsx:

IMPORTANT: Dashboard has its OWN simple header, NO footer, NO complex navigation

Client component with 'use client' directive (has logout)

Import Mantine Container, Group, Text, Button
Import useAuthStore
Import useRouter

Structure as single div:

Header element with borderBottom 1px solid #e0e0e0, padding 1rem 0:
- Container size xl
- Group justify space-between:

  Left side div:
  - Text size xl, fontWeight 700: "Flex Reviews Dashboard"
  - Text size sm, color dimmed: "Logged in as manager@flex.com"

  Right side Button:
  - variant subtle
  - color gray
  - onClick calls handleLogout
  - text "Logout"

Followed by children (the actual dashboard content)

handleLogout function:
- Calls authStore.logout
- Clears auth cookie
- Router push to /login

NO FOOTER in dashboard
Just simple header with logout, then content

Verify:
- Login page is first page visited
- After login, dashboard shows simple header with logout
- Dashboard has no footer
- Logout clears session and redirects to login
```

---

## Phase 15: Property Selector Link to Public Page

### Prompt for Claude Code:

```
Update components/dashboard/PropertySelector.tsx to add "View Public Page" link:

IMPORTANT: This link opens property detail page in NEW TAB so dashboard stays visible

Modify PropertySelector component:

Import Link from next/link
Import IconExternalLink from @tabler/icons-react

After the current rating display, add a section that shows when a property is selected:

If selectedId exists:
- Group with gap xs, margin top sm:
  - Text size sm, color dimmed: "Preview public page:"
  - Button component as Link:
    * href as `/property/{selectedId}`
    * target "_blank"
    * rel "noopener noreferrer"
    * variant "subtle"
    * size "sm"
    * rightSection with IconExternalLink size 14
    * text "View Public Page"

This creates a link that:
- Opens /property/{propertyId} in new browser tab
- Keeps dashboard visible in original tab
- Allows manager to preview what guests see
- Uses external link icon to indicate opens in new tab

Verify:
- Dashboard displays link for selected property
- Clicking link opens property page in new tab
- Dashboard remains visible in original tab
- Link works for all three properties
```

---

## Phase 16: README & Final Polish

### Prompt for Claude Code:

```
Create comprehensive README.md in root directory:

Include these sections with complete information:

Project title: Flex Living Reviews Dashboard

Overview section:
- Property review management system for Flex Living
- Manager dashboard with analytics and approval workflow
- Public property pages displaying approved reviews
- Technical assessment demonstrating full-stack capabilities

Tech Stack section listing exact versions:
- Next.js 15.x with App Router and TypeScript
- Mantine UI v7.15.0 for core, charts, and dates components
- Zustand v5.0.2 for state management
- dayjs v1.11.13 for date handling
- recharts v2.15.0 for charts through Mantine
- Tabler Icons for UI icons

Features section divided into:

Manager Dashboard features:
- Multi-property review management
- Comprehensive filtering by channel, category, date range, and rating
- Sorting controls for date, rating, and channel
- Review approval and rejection workflow
- Performance analytics including:
  * Category performance tracking with 30-day trends
  * Rating trends over 6 months
  * Channel-based performance comparison
  * Sentiment analysis with keyword extraction
  * Auto-generated action items
  * Critical issues flagging

Public Property Pages features:
- Clean property detail pages matching Flex Living aesthetic
- Display only approved reviews
- Sort by recent or highest rated
- Category breakdown statistics
- Responsive design

Prerequisites section:
- Node.js 18 or higher
- npm or yarn

Installation section with commands:
- Clone repository command
- Navigate to directory
- Install dependencies with npm install
- Run dev server with npm run dev
- Open localhost:3000

Usage section:

Accessing Manager Dashboard:
- Navigate to localhost:3000 (redirects to login)
- Login with email manager@flex.com and password flex2024
- Dashboard available after authentication

Viewing Public Property Pages:
- Direct URLs for three properties with full localhost paths

API Routes section documenting:

Authentication POST /api/auth/login:
- Request body structure
- Response format
- Cookie handling

Reviews endpoints:
- GET /api/reviews/hostaway with response format (note this is tested by assessment)
- POST /api/reviews/[id]/approve with request and response
- GET /api/reviews/public/[propertyId] with response format

Project Structure section showing:
- app directory with api, dashboard, property, login subdirectories
- components directory with dashboard, property, shared subdirectories
- lib directory with analytics, data, store, utils subdirectories
- data directory with mock-reviews.json
- types directory

Key Design Decisions section explaining:

Architecture choices:
- Next.js App Router for file-based routing
- Server Components for data fetching, Client Components for interactivity
- In-memory data store (production would use database)
- Zustand for clean client state without prop drilling

Data Flow explanation:
- Mock data loaded on server startup
- API routes normalize and serve data
- Dashboard fetches and stores in Zustand
- Client-side filtering and sorting for performance
- Metrics calculated on-demand per property

Analytics Implementation details:
- Category Performance with 30-day rolling comparison
- Sentiment Analysis via keyword extraction from negative and positive reviews
- Action Items auto-generated from recurring patterns (3 or more mentions)
- Critical Reviews auto-flagged for rating less than 6 or any category less than 5 in last 30 days
- Channel Stats showing performance breakdown by booking platform

Mock Data Strategy explaining:
- Three properties with distinct scenarios
- Shoreditch Heights Studio as excellence baseline
- Camden Loft showing decline from 8.5 to 6.2 average with cleanliness issues
- Brixton Apartment showing channel mismatch between Airbnb and Booking.com

UI/UX Decisions:
- Color coding: red below 7, yellow 7-8, green 8 and above
- Progressive disclosure from stats to trends to detailed reviews
- Responsive mobile-first design
- Public page aesthetic matching Flex Living minimal professional design from https://theflex.global/property/163276
- Dashboard efficiency with key metrics visible without scrolling

Time Investment section:
- Approximately 10-12 hours total development time

Future Enhancements section for production:
- PostgreSQL database integration
- Real Hostaway API connection
- Email notifications for critical reviews
- Advanced ML-based sentiment analysis
- Multi-manager support with role-based access
- Review response functionality
- Export reports to PDF and Excel
- Real-time updates via WebSocket

Assessment Notes section:
- Demonstrates full-stack TypeScript development
- API design and data normalization
- State management patterns
- Analytics and data visualization
- UI/UX design implementation
- Clean code architecture
- Professional documentation

Built for Flex Living technical assessment - December 2024

Also create .gitignore file if not exists with standard Next.js patterns

Create .env.example showing no environment variables required for local development with note about production variables

Verify README is comprehensive, accurate, and professional
```

---

## Phase 17: Vercel Deployment Configuration

### Prompt for Claude Code:

```
Prepare the application for Vercel deployment:

1. Create vercel.json in root directory:

   Configure build and deployment settings:
   - buildCommand: "npm run build"
   - outputDirectory: ".next"
   - devCommand: "npm run dev"
   - installCommand: "npm install"

   Set environment variables (none required for demo):
   - All configuration is in code for this demo project
   - Production would require NEXT_PUBLIC_BASE_URL environment variable

   Configure rewrites if needed:
   - Already handled by Next.js App Router
   - No additional configuration needed

2. Update package.json scripts (if not already present):

   Ensure these scripts exist:
   - "dev": "next dev"
   - "build": "next build"
   - "start": "next start"
   - "lint": "next lint"

3. Create .env.example in root directory:

   Document environment variables:
```

      No environment variables required for local development
      In production on Vercel, you may want to set:
      NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

```

4. Update next.config.js (if not exists, create it):

Add production optimizations:
- No special configuration needed for this project
- Next.js defaults are sufficient
- Vercel automatically optimizes Next.js apps

5. Verify .gitignore includes:

Essential patterns for Vercel:
- node_modules/
- .next/
- .env*.local
- .vercel

6. Update README.md deployment section:

Add Vercel deployment instructions:

## Deployment to Vercel

This application is optimized for deployment on Vercel:

### Quick Deploy

1. Push your code to GitHub/GitLab/Bitbucket
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and configure build settings
5. Click "Deploy"

### Manual Configuration

If needed, use these settings:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Development Command: `npm run dev`

### Environment Variables

No environment variables are required for the demo.

For production, you may optionally set:
- `NEXT_PUBLIC_BASE_URL`: Your Vercel domain URL

### Post-Deployment

After deployment:
1. Visit your Vercel domain
2. You'll be redirected to /login
3. Use credentials: manager@flex.com / flex2024
4. Access the dashboard and all features

### Custom Domain (Optional)

To add a custom domain:
1. Go to Project Settings in Vercel
2. Navigate to Domains
3. Add your custom domain
4. Update DNS records as instructed

### Continuous Deployment

Vercel automatically deploys:
- Every push to main branch → Production
- Every pull request → Preview deployment
- No additional configuration needed

7. Test production build locally:

Before deploying to Vercel, verify:
- Run: npm run build
- Check for any build errors
- Run: npm run start
- Test in production mode at http://localhost:3000
- Verify all features work in production build

Verify:
- Build completes successfully
- No TypeScript errors
- Application runs in production mode
- All routes accessible
- API routes functional
- Ready for Vercel deployment
```

---

## Final Verification Checklist

After completing all phases, verify:

```
Build Verification:
- Run: npm run build
- Ensure no TypeScript errors
- Ensure no build errors

Functional Testing:
- Login with manager@flex.com / flex2024 → access dashboard
- Login with wrong credentials → error message
- Dashboard loads all 3 properties
- Switch between properties → metrics update
- Apply filters → reviews filter correctly
- Toggle review approval → state updates
- Click "View Public Page" link → opens property in new tab, dashboard stays visible
- Visit /property/prop-001 → shows only approved reviews
- Visit /property/prop-002 → Camden Loft with declining trend visible
- Visit /property/prop-003 → Brixton with channel mismatch visible

API Testing:
- Test: curl http://localhost:3000/api/reviews/hostaway
- Should return 39 normalized reviews
- Check structure matches NormalizedReview type

Visual Testing:
- Dashboard displays all analytics sections
- Charts render correctly
- Sentiment analysis shows keywords
- Critical issues section populated for Camden Loft
- Public pages match clean Flex aesthetic from https://theflex.global/property/163276
- Dashboard has simple header with logout, no footer
- Property pages have full layout with header and footer

Code Quality:
- No console.log statements in production code
- Consistent code formatting
- TypeScript strict mode passing
- Comments only where needed for complex logic

Documentation:
- README accurate and complete
- API routes documented
- Setup instructions clear
- Architecture explained
- Reference to Flex Living design included
```
