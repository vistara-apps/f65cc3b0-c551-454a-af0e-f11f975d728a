import { NextRequest, NextResponse } from 'next/server';
import { optimizeRoute, type RouteOptions } from '@/lib/route-optimization';
import { mockNodes } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userLocation,
      maxNodes = 5,
      maxDistance = 10,
      optimization = 'earnings'
    }: {
      userLocation?: [number, number];
      maxNodes?: number;
      maxDistance?: number;
      optimization?: 'earnings' | 'distance' | 'time';
    } = body;

    const options: RouteOptions = {
      maxNodes,
      maxDistance,
      userLocation,
      optimization
    };

    const route = optimizeRoute(mockNodes, options);

    return NextResponse.json({
      success: true,
      route
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to optimize route'
      },
      { status: 400 }
    );
  }
}

