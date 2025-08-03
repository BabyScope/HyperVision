'use client';

import { useState, useEffect } from 'react';
import * as z from 'zod';
import type { Position, SpotBalance } from '@/types';
import { getPositions } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/hypervision/Header';
import { WalletInputForm } from '@/components/hypervision/WalletInputForm';
import { PositionCarousel } from '@/components/hypervision/PositionCarousel';
import { BalanceCard } from '@/components/hypervision/BalanceCard';

// Define the schema type here to avoid importing from a client component into a server action file
const formSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

const REFRESH_INTERVAL = 30000; // 30 seconds

export default function Home() {
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [spotBalances, setSpotBalances] = useState<SpotBalance[] | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPositions = async (address: string) => {
    const result = await getPositions(address);
    
    if (result.success) {
      setPositions(result.data.positions);
      setSpotBalances(result.data.spotBalances);
      setWalletBalance(result.data.walletBalance);
    } else {
      setPositions([]);
      setSpotBalances([]);
      setWalletBalance(0);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  const handleFetchPositions = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setPositions(null); // Clear previous positions
    setSpotBalances(null);
    setWalletBalance(null);
    
    await fetchPositions(values.walletAddress);
    setCurrentWalletAddress(values.walletAddress);

    setIsLoading(false);
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      handleFetchPositions({ walletAddress: storedAddress });
    }
  }, []);

  useEffect(() => {
    if (currentWalletAddress) {
      localStorage.setItem('walletAddress', currentWalletAddress);
      const intervalId = setInterval(() => {
        fetchPositions(currentWalletAddress);
      }, REFRESH_INTERVAL);

      // Clear the interval when the component unmounts or the address changes
      return () => clearInterval(intervalId);
    }
  }, [currentWalletAddress]);


  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8">
      <div className="w-full max-w-7xl">
        <Header />
        <div className="mt-4">
          <WalletInputForm onSubmit={handleFetchPositions} isLoading={isLoading} />
        </div>
        <div className="mt-12 w-full max-w-lg mx-auto">
            <BalanceCard spotBalances={spotBalances} walletBalance={walletBalance} isLoading={isLoading} />
        </div>
        <div className="mt-12">
          <PositionCarousel positions={positions} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
