 export const formatPrice = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `${value.toFixed(2)}`;
  };

  export const formatDifficulty = (value: number): string => {
    if (value >= 1e15) return `${(value / 1e15).toFixed(2)}Q`;
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
  };

  export const formatHashrate = (value: number): string => {
    if (value >= 1e18) return `${(value / 1e18).toFixed(2)}EH/s`;
    if (value >= 1e15) return `${(value / 1e15).toFixed(2)}PH/s`;
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}TH/s`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}GH/s`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}MH/s`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}KH/s`;
    return `${value.toFixed(2)}H/s`;
  };