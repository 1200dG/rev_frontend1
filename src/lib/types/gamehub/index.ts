export interface Season {
  id: number;
  title: string;
  is_active: boolean;
}

export interface Tournament {
  id: number;
  tournament_id: string;
  title: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: string;
  total_points: number;
  wins: number;
  streak: number;
  is_current : boolean;
}

export interface Stats {
  ranking: number | null;
  points: number;
  wins: number;
  streak: number;
  hints: number;
  lives: number;
  best_ranking?: number;
}

export interface GamehubResponseData {
  season: Season | null;
  tournaments: Tournament[];
  leaderboard: LeaderboardEntry[];
  stats: Stats;
  has_played_daily_riddle: boolean;
  is_daily_riddle_available: boolean;
}

export interface ApiResponse<T> {
  status: number;
  message?: string;
  data: T;
}
