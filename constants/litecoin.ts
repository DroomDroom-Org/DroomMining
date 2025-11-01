export const chartTimeRanges = [
    { label: '1D', value: '1days' },
    { label: '7D', value: '7days' },
    { label: '1M', value: '1months' },
    { label: '3M', value: '3months' },
    { label: '6M', value: '6months' },
];


export const litecoinCalculatorFaqs = [
  {
    question: "How to use the Litecoin mining calculator?",
    answer: [
      "Every aspect of our Litecoin mining calculator has been developed for miners by miners.",
      "Enter your hashrate (MH/s), power (W), electricity cost ($/kWh), and pool/maintenance fees.",
      "Or select from the Litecoin miners list to auto-fill hardware specs from top LTC ASICs.",
      "Click 'Calculate Profit' to see real-time LTC earnings, ROI, and break-even timeline.",
      "Inputs preload with best-in-class LTC miner specs (e.g., 17,000 MH/s, 3,450W) and live network data.",
      "Results update instantly — mining difficulty, LTC price, and block reward pulled in real time.",
      "Top 5 Litecoin miners list updated frequently for optimal profitability tracking.",
    ],
  },
  {
    question: "Is Litecoin mining still profitable?",
    answer: [
      "Not right now with standard hardware and average electricity costs.",
      "Example: 17,000 MH/s → ~0.01798 LTC/day (~$1.77 revenue at $98.74/LTC).",
      "After $8.28 electricity + fees → ~($6.51) daily loss.",
      "Profitability depends on hashrate, power efficiency, and LTC price — currently unprofitable at scale.",
      "Difficulty: 118,847,444.68 | Block Reward: 6.25 LTC | Network dominated by large farms.",
      "Check frequently — small difficulty drops or LTC price surges can flip profitability.",
    ],
  },
  {
    question: "How many Litecoin can you mine a day?",
    answer: [
      "With 17,000 MH/s: ~0.01798 LTC/day.",
      "At current difficulty (118,847,444.68) and block reward (6.25 LTC).",
      "Revenue: ~$1.77/day (at $98.74/LTC).",
      "After $8.28 power (3,450W × $0.10/kWh × 24h) + pool fees → ~($6.51) net profit.",
      "Use calculator with your exact hashrate and costs for personalized output.",
    ],
  },
  {
    question: "How long does it take to mine 1 Litecoin?",
    answer: [
      "At 17,000 MH/s: ~55.6 days to mine 1 LTC.",
      "Based on current difficulty, block reward, and network hashrate.",
      "Does NOT factor future difficulty changes or halving (next ~2027).",
      "Most miners use pools with daily payouts — no need to wait for full coins.",
    ],
  },
  {
    question: "What are the default Litecoin mining calculator inputs?",
    answer: [
      "Hashrate: 17,000.00 MH/s (top-tier ASIC spec)",
      "Power: 3,450 watts",
      "Electricity Cost: $0.10 per kWh",
      "Difficulty: 118,847,444.68",
      "Block Reward: 6.25 LTC",
      "LTC Price: $98.74",
      "Pool/Maintenance Fee: Included in profitability model",
    ],
  },
];