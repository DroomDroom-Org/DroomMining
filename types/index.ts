export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface BitcoinStats {
  blockCount: number;
  difficulty: number;
  networkHashrate: number;
  blockReward: number;
  blockTime: number;
  difficultyRetarget: number;
  volume: number;
};

export interface ZcashStats {
  blockCount: number;
  difficulty: number;
  networkHashrate: number;
  blockReward: number;
  blockTime: number;
  difficultyRetarget: number;
  volume: number;
};
