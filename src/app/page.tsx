'use client';

import { useState } from 'react';
import * as z from 'zod';
import type { Position } from '@/types';
import { getPositions } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/hypervision/Header';
import { WalletInputForm } from '@/components/hypervision/WalletInputForm';
import { PositionCarousel } from '@/components/hypervision/PositionCarousel';

// Define the schema type here to avoid importing from a client component into a server action file
const formSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export default function Home() {
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchPositions = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setPositions(null); // Clear previous positions
    
    const result = await getPositions(values.walletAddress);
    
    if (result.success) {
      setPositions(result.data);
    } else {
      setPositions([]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unexpected error occurred.',
      });
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8">
      <div className="w-full max-w-7xl">
        <Header />
        <div className="mt-4">
          <WalletInputForm onSubmit={handleFetchPositions} isLoading={isLoading} />
        </div>
        <div className="mt-12">
          <PositionCarousel positions={positions} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
