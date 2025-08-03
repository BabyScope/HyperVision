import type { SpotBalance } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet2 } from 'lucide-react';

type BalanceCardProps = {
    spotBalances: SpotBalance[] | null;
    walletBalance: number | null;
    isLoading: boolean;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatNumber(value: number) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function BalanceCard({ spotBalances, walletBalance, isLoading }: BalanceCardProps) {
    if (isLoading) {
        return (
            <Card className="w-full shadow-lg">
                <CardHeader>
                    <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-10 w-1/2 bg-muted rounded animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                            <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
                        </div>
                         <div className="flex justify-between">
                            <div className="h-5 w-20 bg-muted rounded animate-pulse"></div>
                            <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!spotBalances || walletBalance === null) {
        return null;
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Wallet2 className="h-8 w-8 text-primary" />
                    <CardTitle>Your Balances</CardTitle>
                </div>
                <CardDescription>A summary of your wallet and spot account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground">Total Account Value</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(walletBalance)}</p>
                </div>
                {spotBalances.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-lg mb-2">Spot Balances</h4>
                        <div className="space-y-2">
                            {spotBalances.map((balance) => (
                                <div key={balance.coin} className="flex justify-between items-center text-sm">
                                    <p className="font-medium">{balance.coin}</p>
                                    <p className="text-muted-foreground">{formatNumber(balance.total)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
