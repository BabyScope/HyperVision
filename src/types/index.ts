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

// This type defines the structure of a spot balance object.
export type SpotBalance = {
    coin: string;
    total: number;
}

// This type represents the structure of the response from the getPositions server action.
export type PositionsResponse = {
  success: boolean;
  data: {
    positions: Position[];
    spotBalances: SpotBalance[];
    walletBalance: number;
  };
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

export type HyperliquidSpotBalance = {
    coin: string;
    total: string;
}
