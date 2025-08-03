'use server';

import type { PositionsResponse, Position, HyperliquidPosition } from '@/types';

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

export async function getPositions(
  address: string
): Promise<PositionsResponse> {
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return {
      success: false,
      data: [],
      error: 'Invalid wallet address provided.',
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'clearinghouseState',
        user: address,
      }),
    });

    if (!response.ok) {
      // Handle non-2xx responses
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status}: ${errorText}`);
      return { success: false, data: [], error: `Failed to fetch positions from Hyperliquid API. Status: ${response.status}` };
    }

    const data = await response.json();

    // The API returns an object with assetPositions, or an empty array if no user found.
    if (data && data.assetPositions) {
      const transformedPositions = data.assetPositions.map(transformPosition);
      return { success: true, data: transformedPositions };
    } else if (Array.isArray(data) && data.length === 0) {
      // This case handles when the user address is not found and API returns an empty array.
      return { success: true, data: [] };
    } else {
        // Handle cases where the response is not in the expected format
        console.error('Unexpected API response format:', data);
        return { success: false, data: [], error: 'Received an unexpected response format from the server.' };
    }

  } catch (error) {
    console.error('Error fetching positions:', error);
    if (error instanceof Error) {
        return { success: false, data: [], error: error.message };
    }
    return { success: false, data: [], error: 'An unknown error occurred while fetching positions.' };
  }
}
