'use server';

import type { PositionsResponse, Position, HyperliquidPosition, SpotBalance, HyperliquidSpotBalance } from '@/types';

// The API endpoint for Hyperliquid
const API_URL = 'https://api.hyperliquid.xyz/info';

// Helper function to transform the API response to our app's Position type
function transformPosition(apiPosition: HyperliquidPosition): Position {
  const entryPx = parseFloat(apiPosition.position.entryPx || '0');
  const positionValue = parseFloat(apiPosition.position.positionValue || '0');
  const szi = parseFloat(apiPosition.position.szi);

  return {
    asset: apiPosition.position.coin,
    side: szi > 0 ? 'Long' : 'Short',
    entryPrice: entryPx,
    pnl: parseFloat(apiPosition.position.unrealizedPnl),
    pnlPercentage: parseFloat(apiPosition.position.returnOnEquity) * 100,
    leverage: apiPosition.position.leverage.value,
    size: positionValue, // positionValue represents the size in USD
    liquidationPrice: apiPosition.position.liquidationPx ? parseFloat(apiPosition.position.liquidationPx) : null,
    margin: parseFloat(apiPosition.position.marginUsed),
  };
}

function transformSpotBalance(apiBalance: HyperliquidSpotBalance): SpotBalance {
    return {
        coin: apiBalance.coin,
        total: parseFloat(apiBalance.total),
    };
}


export async function getPositions(
  address: string
): Promise<PositionsResponse> {
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return {
      success: false,
      data: { positions: [], spotBalances: [], walletBalance: 0 },
      error: 'Invalid wallet address provided.',
    };
  }

  try {
    const clearinghousePromise = fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'clearinghouseState',
        user: address,
      }),
    });

    const spotPromise = fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'spotClearinghouseState', user: address }),
    });

    const [clearinghouseRes, spotRes] = await Promise.all([clearinghousePromise, spotPromise]);


    if (!clearinghouseRes.ok) {
      const errorText = await clearinghouseRes.text();
      console.error(`API request failed with status ${clearinghouseRes.status}: ${errorText}`);
      return { success: false, data: { positions: [], spotBalances: [], walletBalance: 0 }, error: `Failed to fetch positions from Hyperliquid API. Status: ${clearinghouseRes.status}` };
    }
     if (!spotRes.ok) {
      const errorText = await spotRes.text();
      console.error(`API request failed with status ${spotRes.status}: ${errorText}`);
      return { success: false, data: { positions: [], spotBalances: [], walletBalance: 0 }, error: `Failed to fetch spot balances from Hyperliquid API. Status: ${spotRes.status}` };
    }


    const clearinghouseData = await clearinghouseRes.json();
    const spotData = await spotRes.json();

    let transformedPositions: Position[] = [];
    let walletBalance = 0;
    
    if (clearinghouseData && clearinghouseData.assetPositions) {
      transformedPositions = clearinghouseData.assetPositions.map(transformPosition);
      walletBalance = parseFloat(clearinghouseData.marginSummary.accountValue);
    } else if (Array.isArray(clearinghouseData) && clearinghouseData.length === 0) {
      // This case handles when the user address is not found and API returns an empty array.
       transformedPositions = [];
       walletBalance = 0;
    }

    let transformedSpotBalances: SpotBalance[] = [];
    if(spotData && spotData.balances){
        transformedSpotBalances = spotData.balances.map(transformSpotBalance);
    }

    return { success: true, data: { positions: transformedPositions, spotBalances: transformedSpotBalances, walletBalance } };

  } catch (error) {
    console.error('Error fetching positions:', error);
    if (error instanceof Error) {
        return { success: false, data: { positions: [], spotBalances: [], walletBalance: 0 }, error: error.message };
    }
    return { success: false, data: { positions: [], spotBalances: [], walletBalance: 0 }, error: 'An unknown error occurred while fetching positions.' };
  }
}
