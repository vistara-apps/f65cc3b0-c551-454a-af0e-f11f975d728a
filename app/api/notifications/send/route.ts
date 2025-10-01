import { NextRequest, NextResponse } from 'next/server';
import { NotificationData } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const notificationData: NotificationData = await request.json();

    // In production, this would integrate with MiniKit notifications API
    // For now, we'll simulate the notification sending

    console.log('Processing notification:', notificationData);

    // Simulate MiniKit notification API call
    const miniKitResponse = await fetch('https://api.coinbase.com/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COINBASE_API_KEY}`,
      },
      body: JSON.stringify({
        type: 'notification',
        title: notificationData.title,
        message: notificationData.message,
        action_url: notificationData.actionUrl,
        action_text: notificationData.actionText,
        metadata: {
          node_id: notificationData.nodeId,
          amount: notificationData.amount,
          friend_name: notificationData.friendName,
          region: notificationData.region,
        },
      }),
    });

    if (!miniKitResponse.ok) {
      throw new Error('Failed to send MiniKit notification');
    }

    const result = await miniKitResponse.json();

    return NextResponse.json({
      success: true,
      notificationId: result.id,
      message: 'Notification sent successfully'
    });

  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

