import { NextRequest, NextResponse } from 'next/server';
import { mockEarnings } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    // Calculate user's earnings stats
    const totalEarnings = mockEarnings.reduce((sum, e) => sum + e.amount_usd, 0);
    const topNetwork = mockEarnings.reduce((prev, current) =>
      prev.amount_usd > current.amount_usd ? prev : current
    ).network_type;

    const regionalAverage = 856.12; // Mock regional average
    const userRank = 4; // Mock user rank

    const frameResponse = {
      frames: [
        {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/earnings-share/image?earnings=${totalEarnings}&network=${topNetwork}&rank=${userRank}`,
          buttons: [
            {
              label: 'View My Dashboard',
              action: 'link',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/earnings`
            },
            {
              label: 'Compare with Friends',
              action: 'link',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/leaderboard`
            },
            {
              label: 'Share on Farcaster',
              action: 'link',
              target: `https://warpcast.com/~/compose?text=I%20earned%20$${totalEarnings.toFixed(2)}%20from%20DePIN%20nodes%20this%20month%20🏆%20Top%20network:%20${topNetwork}&embeds[]=${process.env.NEXT_PUBLIC_APP_URL}/api/frames/earnings-share`
            }
          ],
          postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/earnings-share`
        }
      ]
    };

    return NextResponse.json(frameResponse);
  } catch (error) {
    console.error('Earnings share frame error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Calculate user's earnings stats
  const totalEarnings = mockEarnings.reduce((sum, e) => sum + e.amount_usd, 0);
  const topNetwork = mockEarnings.reduce((prev, current) =>
    prev.amount_usd > current.amount_usd ? prev : current
  ).network_type;

  const regionalAverage = 856.12; // Mock regional average
  const userRank = 4; // Mock user rank

  // Return initial frame
  const frameResponse = {
    frames: [
      {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/earnings-share/image?earnings=${totalEarnings}&network=${topNetwork}&rank=${userRank}`,
        buttons: [
          {
            label: 'View Full Dashboard',
            action: 'link',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/earnings`
          },
          {
            label: 'See Leaderboard',
            action: 'link',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/leaderboard`
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/earnings-share`
      }
    ]
  };

  return NextResponse.json(frameResponse);
}

