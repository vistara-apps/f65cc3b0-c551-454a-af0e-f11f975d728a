import { NextRequest, NextResponse } from 'next/server';
import { mockLeaderboard } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    // Get user's position (mocked as rank 4)
    const userEntry = mockLeaderboard.find(entry => entry.user_fid_anon === 'You') || mockLeaderboard[3];
    const topThree = mockLeaderboard.slice(0, 3);

    const frameResponse = {
      frames: [
        {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/leaderboard/image?rank=${userEntry.rank}&earnings=${userEntry.total_earnings_30d}`,
          buttons: [
            {
              label: 'View Full Leaderboard ($0.50)',
              action: 'post',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/leaderboard/premium`
            },
            {
              label: 'Challenge Friend',
              action: 'link',
              target: `https://warpcast.com/~/compose?text=I%27m%20ranked%20%23${userEntry.rank}%20in%20NodeHuntr%20with%20$${userEntry.total_earnings_30d.toFixed(2)}%20earnings%20this%20month!%20Can%20you%20beat%20me?%20🏆&embeds[]=${process.env.NEXT_PUBLIC_APP_URL}/api/frames/leaderboard`
            },
            {
              label: 'Join NodeHuntr',
              action: 'link',
              target: process.env.NEXT_PUBLIC_APP_URL
            }
          ],
          postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/leaderboard`
        }
      ]
    };

    return NextResponse.json(frameResponse);
  } catch (error) {
    console.error('Leaderboard frame error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Get user's position (mocked as rank 4)
  const userEntry = mockLeaderboard.find(entry => entry.user_fid_anon === 'You') || mockLeaderboard[3];

  // Return initial frame
  const frameResponse = {
    frames: [
      {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/leaderboard/image?rank=${userEntry.rank}&earnings=${userEntry.total_earnings_30d}`,
        buttons: [
          {
            label: 'View Leaderboard',
            action: 'link',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/leaderboard`
          },
          {
            label: 'Start Earning',
            action: 'link',
            target: process.env.NEXT_PUBLIC_APP_URL
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/leaderboard`
      }
    ]
  };

  return NextResponse.json(frameResponse);
}

