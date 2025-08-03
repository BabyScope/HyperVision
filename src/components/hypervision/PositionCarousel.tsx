'use client';

import type { Position } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PositionTile } from './PositionTile';
import { Card, CardContent } from '../ui/card';
import { SearchX, Wallet } from 'lucide-react';

type PositionCarouselProps = {
  positions: Position[] | null;
  isLoading: boolean;
};

export function PositionCarousel({ positions, isLoading }: PositionCarouselProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
         <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
                {Array.from({ length: 3 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex flex-col space-y-4 p-6 animate-pulse">
                                    <div className="flex justify-between items-center">
                                        <div className="h-8 w-32 bg-muted rounded"></div>
                                        <div className="h-6 w-20 bg-muted rounded-full"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-muted rounded"></div>
                                    <div className="space-y-2">
                                      <div className="h-4 w-1/4 bg-muted rounded"></div>
                                      <div className="h-10 w-3/4 bg-muted rounded"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="space-y-2">
                                            <div className="h-4 w-1/2 bg-muted rounded"></div>
                                            <div className="h-5 w-3/4 bg-muted rounded"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-1/2 bg-muted rounded"></div>
                                            <div className="h-5 w-3/4 bg-muted rounded"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
      </div>
    );
  }

  if (!positions) {
    return (
        <Card className="w-full max-w-lg mx-auto mt-10 text-center shadow-lg">
            <CardContent className="p-10 flex flex-col items-center gap-4">
                <Wallet className="h-16 w-16 text-primary"/>
                <h3 className="text-xl font-semibold">View Your Positions</h3>
                <p className="text-muted-foreground">Enter a wallet address above to start tracking.</p>
            </CardContent>
        </Card>
    )
  }

  if (positions.length === 0) {
    return (
         <Card className="w-full max-w-lg mx-auto mt-10 text-center shadow-lg">
            <CardContent className="p-10 flex flex-col items-center gap-4">
                <SearchX className="h-16 w-16 text-destructive"/>
                <h3 className="text-xl font-semibold">No Open Positions</h3>
                <p className="text-muted-foreground">This wallet address does not have any open positions, or the address is incorrect.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Open Positions ({positions.length})</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: positions.length > 2,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {positions.map((position, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <PositionTile position={position} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
