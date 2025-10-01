import { NextRequest, NextResponse } from 'next/server';
import { mockNodes } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    // Extract node_id from frame URL or button data
    const url = new URL(untrustedData?.url || '');
    const nodeId = url.searchParams.get('node_id');

    if (!nodeId) {
      return NextResponse.json({
        success: false,
        error: 'Node ID required'
      }, { status: 400 });
    }

    const node = mockNodes.find(n => n.id === nodeId);
    if (!node) {
      return NextResponse.json({
        success: false,
        error: 'Node not found'
      }, { status: 404 });
    }

    // Simulate live status check
    const isOnline = Math.random() > 0.1; // 90% uptime
    const lastVerified = new Date(Date.now() - Math.random() * 3600000).toISOString(); // Within last hour

    const frameResponse = {
      frames: [
        {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/node-status/image?node_id=${nodeId}&status=${isOnline ? 'online' : 'offline'}`,
          buttons: [
            {
              label: 'Check Status',
              action: 'post',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/node-status`
            },
            {
              label: 'Report Issue ($0.05)',
              action: 'post',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/report-issue?node_id=${nodeId}`
            },
            {
              label: 'Get Directions',
              action: 'link',
              target: `https://www.google.com/maps/search/?api=1&query=${node.lat},${node.lng}`
            }
          ],
          input: {
            text: 'Optional: Report issue details'
          },
          postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/node-status`
        }
      ]
    };

    return NextResponse.json(frameResponse);
  } catch (error) {
    console.error('Frame error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nodeId = searchParams.get('node_id');

  if (!nodeId) {
    return NextResponse.json({
      success: false,
      error: 'Node ID required'
    }, { status: 400 });
  }

  const node = mockNodes.find(n => n.id === nodeId);
  if (!node) {
    return NextResponse.json({
      success: false,
      error: 'Node not found'
    }, { status: 404 });
  }

  // Return initial frame
  const frameResponse = {
    frames: [
      {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/node-status/image?node_id=${nodeId}`,
        buttons: [
          {
            label: 'Check Live Status',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/node-status?node_id=${nodeId}`
          },
          {
            label: 'View in App',
            action: 'link',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/?node=${nodeId}`
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/node-status`
      }
    ]
  };

  return NextResponse.json(frameResponse);
}

