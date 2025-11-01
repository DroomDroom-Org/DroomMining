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
  hashrate: number;        
  hashrateValue: number;   
  hashrateUnit: string;    
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

export interface ZcashCalculator {
  hashrate: number;        
  hashrateValue: number;   
  hashrateUnit: string;    
  power: number;
  electricityCost: number;
  poolFee: number;
}

export interface LitecoinStats {
  blockCount: number;
  difficulty: number;
  networkHashrate: number;
  blockReward: number;
  blockTime: number;
  difficultyRetarget: number;
  volume: number;
  price: number;
};

export interface LitecoinCalculator {
  hashrate: number;        
  hashrateValue: number;   
  hashrateUnit: string;    
  power: number;
  electricityCost: number;
  poolFee: number;
}
