import { Node } from './types';

export interface NotificationData {
  type: 'node_offline' | 'earnings_dispute_resolved' | 'leaderboard_update' | 'new_high_reward_node';
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  nodeId?: string;
  amount?: number;
  friendName?: string;
  region?: string;
}

export class NotificationManager {
  private static instance: NotificationManager;

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async sendNotification(data: NotificationData) {
    // In production, this would integrate with MiniKit notifications
    // For now, we'll simulate the notification

    console.log('Sending notification:', data);

    // Simulate API call to MiniKit
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Notification error:', error);
      // Fallback: show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.message,
          icon: '/icon-192x192.png',
        });
      }
      throw error;
    }
  }

  // Predefined notification templates
  async notifyNodeOffline(node: Node, userLocation?: [number, number]) {
    const nearbyNodes = await this.findNearbyNodes(node, userLocation);

    return this.sendNotification({
      type: 'node_offline',
      title: 'Node Offline',
      message: `${node.name || `Node ${node.id}`} is now offline. ${nearbyNodes.length > 0 ? `${nearbyNodes.length} alternatives nearby.` : ''}`,
      actionUrl: `/`,
      actionText: 'View alternatives',
      nodeId: node.id,
    });
  }

  async notifyEarningsDisputeResolved(amount: number, disputeId: string) {
    return this.sendNotification({
      type: 'earnings_dispute_resolved',
      title: 'Dispute Resolved!',
      message: `Your earnings dispute for $${amount} has been approved. Funds credited to your account.`,
      actionUrl: '/earnings',
      actionText: 'View earnings',
      amount,
    });
  }

  async notifyLeaderboardUpdate(friendName: string, region: string) {
    return this.sendNotification({
      type: 'leaderboard_update',
      title: 'Leaderboard Update',
      message: `${friendName} just passed you in the ${region} leaderboard!`,
      actionUrl: '/leaderboard',
      actionText: 'View leaderboard',
      friendName,
      region,
    });
  }

  async notifyNewHighRewardNode(node: Node, distance: number) {
    return this.sendNotification({
      type: 'new_high_reward_node',
      title: 'High Reward Node Nearby!',
      message: `New node paying $${node.reward_rate_usd}/hr just appeared ${distance.toFixed(1)}mi away.`,
      actionUrl: `/?node=${node.id}`,
      actionText: 'Get directions',
      nodeId: node.id,
      amount: node.reward_rate_usd,
    });
  }

  private async findNearbyNodes(offlineNode: Node, userLocation?: [number, number]): Promise<Node[]> {
    // Mock implementation - in production, query database
    // This would find active nodes within reasonable distance
    return [];
  }
}

// Export singleton instance
export const notifications = NotificationManager.getInstance();

