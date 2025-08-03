'use client';

import { useState } from 'react';
import type { Position } from '@/types';
import { analyzePositions } from '@/ai/flows/analyze-positions-flow';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Wand2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type PortfolioAnalysisProps = {
    positions: Position[];
    walletBalance: number;
}

export function PortfolioAnalysis({ positions, walletBalance }: PortfolioAnalysisProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await analyzePositions({ positions, walletBalance });
            setAnalysis(result.analysis);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Failed to analyze portfolio:", error);
            // Optionally, show a toast notification for the error
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Button onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Get AI Analysis
                    </>
                )}
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Wand2 className="h-6 w-6 text-primary" />
                            Your Portfolio Analysis
                        </DialogTitle>
                        <DialogDescription>
                            Here is an AI-powered analysis of your current portfolio. This is not financial advice.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto">
                        {analysis ? (
                           <ReactMarkdown
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-semibold" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-semibold" {...props} />,
                                p: ({node, ...props}) => <p className="text-base" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5" {...props} />,
                                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                            }}
                           >
                            {analysis}
                           </ReactMarkdown>
                        ) : (
                            <p>Loading analysis...</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
