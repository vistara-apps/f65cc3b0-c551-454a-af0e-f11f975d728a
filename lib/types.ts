export interface Node {
  id: string;
  network_type: 'helium' | 'xnet' | 'geodnet' | 'hivemapper';
  lat: number;
  lng: number;
  status: 'active' | 'inactive' | 'pending';
  last_seen: string;
  reward_rate_usd: number;
  reliability_score: number;
  total_verifications: number;
  name?: string;
}

export interface User {
  farcaster_fid?: string;
  wallet_address?: string;
  reputation_score: number;
  total_earnings_tracked: number;
  networks_connected: string[];
}

export interface EarningsRecord {
  user_fid?: string;
  node_id: string;
  network_type: string;
  amount_usd: number;
  amount_native_token: number;
  status: 'confirmed' | 'pending' | 'disputed';
  reported_at: string;
  verified_at?: string;
}

export interface Route {
  nodes: Node[];
  total_distance_km: number;
  estimated_earnings_usd: number;
  estimated_time_minutes: number;
  waypoints: [number, number][];
}

export interface LeaderboardEntry {
  rank: number;
  user_fid_anon: string;
  total_earnings_30d: number;
  nodes_verified: number;
  region: string;
}
