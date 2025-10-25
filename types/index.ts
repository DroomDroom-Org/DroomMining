export interface ChartDataPoint {
  timestamp: number;
  price: number;
  priceVisual?: number;
  volume: number;
  percent_change_24h?: number;
}