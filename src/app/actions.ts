'use server';

import type { PositionsResponse, Position } from '@/types';

const MOCK_POSITIONS: Position[] = [
  {
    asset: 'BTC-PERP',
    side: 'Long',
    entryPrice: 68543.21,
    pnl: 1254.83,
    pnlPercentage: 18.23,
    leverage: 10,
    size: 12500.5,
    liquidationPrice: 62112.45,
    margin: 1250.05,
  },
  {
    asset: 'ETH-PERP',
    side: 'Short',
    entryPrice: 3540.5,
    pnl: -240.15,
    pnlPercentage: -5.8,
    leverage: 25,
    size: 8500,
    liquidationPrice: 3890.7,
    margin: 340,
  },
  {
    asset: 'SOL-PERP',
    side: 'Long',
    entryPrice: 165.8,
    pnl: 88.9,
    pnlPercentage: 35.1,
    leverage: 5,
    size: 5000,
    liquidationPrice: 140.2,
    margin: 1000,
  },
    {
    asset: 'DOGE-PERP',
    side: 'Short',
    entryPrice: 0.15,
    pnl: 45.12,
    pnlPercentage: 15.2,
    leverage: 50,
    size: 20000,
    liquidationPrice: 0.18,
    margin: 400,
  },
];

const MOCK_WALLET_ADDRESS = '0x1234567890123456789012345678901234567890';

export async function getPositions(
  address: string
): Promise<PositionsResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (address.toLowerCase() === MOCK_WALLET_ADDRESS) {
    return { success: true, data: MOCK_POSITIONS };
  }

  if(address) {
     return { success: true, data: [] };
  }

  return {
    success: false,
    data: [],
    error: 'Invalid wallet address provided.',
  };
}
