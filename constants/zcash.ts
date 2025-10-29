export const chartTimeRanges = [
    { label: '1D', value: '1days' },
    { label: '7D', value: '7days' },
    { label: '1M', value: '1months' },
    { label: '3M', value: '3months' },
    { label: '6M', value: '6months' },
];


export const zcashCalculatorFaqs = [
  {
    question: "How do I use the Zcash mining calculator?",
    answer: [
      "Enter your hashrate (H/s), power (W), electricity cost ($/kWh), and pool fee (%).",
      "Or select from the Zcash miners list to auto-fill hardware specs.",
      "Click 'Calculate Profit' for real-time ZEC earnings, ROI, and break-even.",
      "Inputs preload with top Zcash ASIC specs and live network data (price, difficulty, reward).",
      "Results update instantly — developed by miners, for miners.",
    ],
  },
  {
    question: "Is Zcash mining still profitable in 2025?",
    answer: [
      "Yes — with efficient ASICs (e.g., 140k H/s) and low power costs (<$0.10/kWh).",
      "Example: 140k H/s → ~0.0336 ZEC/day (~$11.50 revenue at $343/ZEC).",
      "After $3.72 electricity + fees → ~$7.89 daily profit.",
      "Profitability shifts with difficulty (currently ~110M) and price — check live.",
      "Industrial setups in low-cost regions dominate; solo/small-scale viable with pools.",
    ],
  },
  {
    question: "How does Zcash mining work?",
    answer: [
      "Miners solve Equihash puzzles to validate transactions on the privacy-focused Zcash blockchain.",
      "First to solve adds a block and earns 2.5 ZEC reward (post-2024 halving).",
      "Uses GPU/ASIC-friendly algorithm — network hashrate ~11.5 GH/s.",
      "Shielded transactions add privacy; mining secures the zk-SNARKs network.",
      "Unlike Bitcoin, Zcash emphasizes anonymity and selective disclosure.",
    ],
  },
  {
    question: "What hardware do I need to mine Zcash?",
    answer: [
      "ASICs like Bitmain Antminer Z15 or Z9 Mini for max efficiency.",
      "GPUs (e.g., RTX 3080) still viable but less profitable than ASICs.",
      "Hashrate: 100k–500k H/s typical; power: 1,000–2,500W per unit.",
      "Requires 220V+; check specs for Equihash compatibility.",
      "Top list updated frequently — preload uses best available.",
    ],
  },
  {
    question: "How do I set up a Zcash mining rig?",
    answer: [
      "1. Buy Equihash-compatible ASIC/GPU from trusted vendors.",
      "2. Secure stable power (e.g., 200A service → ~33kW usable capacity).",
      "3. Install cooling/internet; join a pool (e.g., F2Pool, ViaBTC).",
      "4. Configure: pool URL, wallet address, worker details.",
      "5. Use software like CGMiner or EWBF for GPUs.",
      "6. Monitor via pool dashboard for hashrate and shares.",
    ],
  },
  {
    question: "What are Zcash mining pools?",
    answer: [
      "Pools combine hashrate for steady rewards — essential at 11.5 GH/s network.",
      "Payouts: PPS/FPPS for stability; fees 1–2% (e.g., F2Pool: 1%).",
      "Popular: F2Pool, ViaBTC, SlushPool, BTC.com — supports ZEC addresses.",
      "Solo mining rare; pools reduce variance for small rigs.",
    ],
  },
  {
    question: "How much Zcash can I mine per day?",
    answer: [
      "Depends on hashrate and difficulty (~110M currently).",
      "Example: 140k H/s → ~0.0336 ZEC/day (~$11.50 at $343/ZEC).",
      "After costs: ~$7.89 net profit (1,550W at $0.10/kWh).",
      "Use calculator for your exact output — updates live.",
    ],
  },
  {
    question: "How long to mine 1 Zcash?",
    answer: [
      "At 140k H/s: ~29.8 days (current difficulty/reward).",
      "At 500k H/s: ~8.3 days.",
      "Does NOT factor halvings (next ~2028) or difficulty spikes.",
      "Most miners payout daily — not waiting for full coins.",
    ],
  },
  {
    question: "How much electricity for Zcash mining?",
    answer: [
      "Power = Hashrate × Efficiency (W/kH/s).",
      "Example: 140k H/s × 11W/kH = ~1,540W.",
      "200A × 220V = 44kW → ~33kW safe (75% max).",
      "Runs ~20 × Z9 Mini (70W each); add cooling costs.",
      "Optimize with efficient ASICs to cut bills.",
    ],
  },
];