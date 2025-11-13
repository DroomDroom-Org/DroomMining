export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface Coin {
  id: string;
  cmcId: number;
  name: string;
  symbol: string;
  blockCount: number;
  difficulty: number;
  networkHashrate: number;
  blockReward: number;
  blockTime: number;
  difficultyRetarget: number;
  volume: number;
  price: number;
  logo: string;
  calculatorHref: string;
  miningHref: string;
}


export interface Stats {
  blockCount: number;
  difficulty: number;
  networkHashrate: number;
  blockReward: number;
  blockTime: number;
  difficultyRetarget: number;
  volume: number;
  price: number;
};


export interface Miner {
  id: number;
  name: string;
  manufacturer: string;
  hashrateValue: number;
  hashrateUnit: string;
  power: number;
  efficiency: number;
  cost: number;
  thumbnail?: string;
  buyUrl?: string;
}

export interface Calculator {
  hashrate: number;
  hashrateValue: number;
  hashrateUnit: string;
  power: number;
  electricityCost: number;
  poolFee: number;
}

export interface Faq {
  question: string;
  answer: string[];
}