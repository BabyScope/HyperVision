// This type defines the structure of a position object used within the application's components.
export type Position = {
  asset: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  pnl: number;
  pnlPercentage: number;
  leverage: number;
  size: number; // Represents position size in USD
  liquidationPrice: number | null;
  margin: number;
};

// This type represents the structure of the response from the getPositions server action.
export type PositionsResponse = {
  success: boolean;
  data: Position[];
  error?: string;
};

// This type represents the structure of the position data as returned by the Hyperliquid API.
// It is used to correctly type the raw API response before it's transformed into the app's `Position` type.
export type HyperliquidPosition = {
  position: {
    coin: string;
    szi: string; // The size of the position. A positive value indicates a long position, and a negative value indicates a short position.
    leverage: {
      type: 'cross' | 'isolated';
      value: number;
    };
    entryPx: string;
    positionValue: string;
    returnOnEquity: string;
    unrealizedPnl: string;
    marginUsed: string;
    maxLeverage: number;
    liquidationPx: string | null;
    isCross: boolean;
  };
  type: 'oneWay';
};
