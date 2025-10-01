# NodeHuntr 🗺️

**Find, track, and maximize your DePIN node earnings in real-time**

A Base MiniApp that helps DePIN node operators discover nearby nodes, track earnings across networks, and optimize routes for maximum rewards through social discovery and community validation.

## 🚀 Features

### Core Features
- **Live Node Map Discovery**: Interactive map showing nearby DePIN nodes with real-time status indicators
- **Reward-Optimized Route Planner**: AI-powered route generator maximizing rewards per hour ($0.10/route)
- **Multi-Network Earnings Dashboard**: Unified view of all DePIN earnings with dispute resolution ($0.25/verification)
- **Community Leaderboard & Node Reputation**: Regional rankings with premium access ($0.50/month)
- **Instant Node Status Check**: QR/NFC scanning for real-time node verification

### Technical Features
- **Base MiniApp**: Native Base ecosystem integration with micropayments
- **Farcaster Frames**: In-feed node status checks and quick actions
- **Privy Authentication**: Seamless wallet connection and embedded wallets
- **Mapbox Integration**: Interactive maps with custom node pins and routing
- **MiniKit Payments**: Frictionless sub-dollar payments using x402 protocol

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Maps**: Mapbox GL JS
- **Payments**: Base MiniKit (x402 micropayments)
- **Auth**: Privy (embedded wallets)
- **Social**: Farcaster Frames v2
- **Deployment**: Vercel (recommended for Base MiniApps)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Base network wallet
- Mapbox account
- Privy account
- Coinbase Developer account

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/f65cc3b0-c551-454a-af0e-f11f975d728a.git
   cd f65cc3b0-c551-454a-af0e-f11f975d728a
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your API keys:
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
   NEXT_PUBLIC_RECIPIENT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc454e4438f44e
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Users
1. **Connect Wallet**: Use Privy to connect your Base wallet or create an embedded wallet
2. **Explore Map**: View nearby DePIN nodes with real-time status and rewards
3. **Scan Nodes**: Use QR codes or NFC tags to verify node status instantly
4. **Plan Routes**: Pay $0.10 to unlock AI-optimized routes for maximum earnings
5. **Track Earnings**: Monitor earnings across all networks with dispute resolution
6. **Compete**: Join regional leaderboards and earn community tokens

### For Developers
- **API Routes**: Check `/api/frames/` for Farcaster frame implementations
- **Components**: Modular React components in `/components/`
- **Types**: TypeScript interfaces in `/lib/types.ts`
- **Mock Data**: Sample data in `/lib/mock-data.ts`

## 🏗️ Architecture

### Data Models
- **User**: Farcaster FID, wallet address, reputation score
- **Node**: Location, network type, status, reward rates
- **EarningsRecord**: Transaction history with verification status
- **Route**: Optimized node sequences with earnings estimates
- **LeaderboardEntry**: Regional rankings and statistics

### API Integrations
- **MiniKit**: Micropayments and notifications
- **Farcaster**: Social features and frames
- **Mapbox**: Maps and routing
- **Privy**: Authentication and wallets
- **Base Scan**: On-chain verification

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Accent**: Green (#10B981)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Danger**: Red (#EF4444)
- **Background**: Dark (#0F0F0F)

### Typography
- **Display**: Bold, large headings
- **Title**: Semibold, section headers
- **Body**: Regular text
- **Label**: Small, uppercase labels
- **Mono**: Code and technical text

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── earnings/          # Earnings page
│   ├── leaderboard/       # Leaderboard page
│   ├── scan/             # Scan page
│   └── page.tsx          # Main map page
├── components/           # React components
├── lib/                 # Utilities and types
├── public/              # Static assets
└── styles/              # Global styles
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base** for the MiniApp ecosystem
- **Farcaster** for social primitives
- **Mapbox** for mapping infrastructure
- **Privy** for seamless authentication
- **Coinbase** for OnchainKit and MiniKit

## 📞 Support

For support, email support@nodehuntr.com or join our Farcaster channel.

---

**Built with ❤️ for the DePIN community**

