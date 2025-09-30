# NodeHuntr - DePIN Node Discovery

A Base MiniApp for discovering, tracking, and maximizing DePIN node earnings in real-time.

## Features

- 🗺️ **Interactive Map**: Discover nearby DePIN nodes with real-time status
- 💰 **Earnings Dashboard**: Track rewards across multiple networks
- 🏆 **Leaderboard**: Compete with other node operators in your region
- 🛣️ **Route Optimization**: Plan efficient routes to maximize earnings
- 🔔 **Smart Notifications**: Get alerted about high-reward nodes nearby

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit)
- **Mapping**: Mapbox GL JS
- **Styling**: Tailwind CSS
- **Authentication**: Privy
- **Payments**: MiniKit 402 Micropayments

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Copy `.env.local.example` to `.env.local` and fill in your API keys:
- OnchainKit API Key: https://portal.cdp.coinbase.com/
- Mapbox Token: https://account.mapbox.com/
- Privy App ID: https://dashboard.privy.io/

3. **Run development server**:
```bash
npm run dev
```

4. **Open in browser**:
Navigate to http://localhost:3000

## Project Structure

```
app/
├── page.tsx              # Map view (home)
├── earnings/             # Earnings dashboard
├── leaderboard/          # Community leaderboard
├── profile/              # User profile
├── layout.tsx            # Root layout
├── providers.tsx         # OnchainKit provider
└── globals.css           # Global styles

components/
├── MapView.tsx           # Interactive map component
├── NodeDetailsSheet.tsx  # Node details bottom sheet
├── EarningsDashboard.tsx # Earnings tracking
├── Leaderboard.tsx       # Leaderboard component
└── BottomNav.tsx         # Bottom navigation

lib/
├── types.ts              # TypeScript types
└── mock-data.ts          # Mock data for development
```

## Design System

### Colors
- **Background**: Dark navy (#0a1423)
- **Accent**: Gold (#ffd700)
- **Success**: Green (#22c55e)
- **Warning**: Orange (#fb923c)
- **Danger**: Red (#ef4444)

### Components
- Glass-morphism cards with backdrop blur
- Smooth animations (200-300ms)
- Mobile-first responsive design
- Accessible touch targets (44x44px minimum)

## Micropayments

NodeHuntr uses Base's 402 micropayment protocol for premium features:
- Route optimization: $0.10
- Earnings verification: $0.25
- Leaderboard access: $0.50/month

## Contributing

This is a demo application. For production use, implement:
- Real DePIN network APIs (Helium, XNET, etc.)
- Proper authentication and user management
- Database for storing user data and earnings
- Real-time node status updates
- Turn-by-turn navigation

## License

MIT
