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
  price: number;
};


export interface BitcoinMiner {
  name: string;
  manufacturer: string;
  hashrateValue: number;
  hashrateUnit: string;
  power: number;
  efficiency: number;
  cost: number;
  url?: string;
}


export interface BitcoinCalculator {
  hashrateUnit: string;
  hashrateValue: number;
  power: number;
  electricityCost: number;
  poolFee: number;
}

export interface BitcoinCalculator {
  hashrate: number;        // H/s (internal)
  hashrateValue: number;   // user-visible number (e.g. 390)
  hashrateUnit: string;    // "TH/s", "PH/s", …
  power: number;
  electricityCost: number;
  poolFee: number;
}

export interface ZcashStats {
  blockCount: number;
  difficulty: number;
  networkHashrate: number;
  blockReward: number;
  blockTime: number;
  difficultyRetarget: number;
  volume: number;
  price: number;
};
