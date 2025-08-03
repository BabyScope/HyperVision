export type Position = {
  asset: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  pnl: number;
  pnlPercentage: number;
  leverage: number;
  size: number;
  liquidationPrice: number | null;
  margin: number;
};

export type PositionsResponse = {
  success: boolean;
  data: Position[];
  error?: string;
};
