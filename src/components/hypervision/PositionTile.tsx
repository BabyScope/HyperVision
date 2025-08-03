import type { Position } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function PositionTile({ position }: { position: Position }) {
  const isProfit = position.pnl >= 0;

  return (
    <Card className="w-full border-l-4" style={{ borderColor: isProfit ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{position.asset}</CardTitle>
          <Badge variant={position.side === 'Long' ? 'default' : 'destructive'} className={cn(position.side === 'Long' ? 'bg-primary/20 text-primary border-primary' : 'bg-destructive/20 text-destructive border-destructive')}>
            {position.side === 'Long' ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
            {position.side}
          </Badge>
        </div>
        <CardDescription>Leverage: {position.leverage}x</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Unrealized PnL</p>
          <div className="flex items-baseline gap-2">
            <p className={cn('text-3xl font-bold', isProfit ? 'text-primary' : 'text-destructive')}>
              {formatCurrency(position.pnl)}
            </p>
            <p className={cn('text-lg font-medium', isProfit ? 'text-primary' : 'text-destructive')}>
              ({isProfit ? '+' : ''}{position.pnlPercentage.toFixed(2)}%)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Size</p>
            <p className="font-medium">{formatCurrency(position.size)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Margin</p>
            <p className="font-medium">{formatCurrency(position.margin)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Entry Price</p>
            <p className="font-medium">{formatCurrency(position.entryPrice)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Liq. Price</p>
            <p className="font-medium">{position.liquidationPrice ? formatCurrency(position.liquidationPrice) : 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
