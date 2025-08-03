'use server';
/**
 * @fileOverview An AI flow to analyze a user's crypto portfolio.
 *
 * - analyzePositions - A function that handles the portfolio analysis.
 * - AnalyzePositionsInput - The input type for the analyzePositions function.
 * - AnalyzePositionsOutput - The return type for the analyzePositions function.
 */

import {ai} from '@/ai/genkit';
import type { Position } from '@/types';
import {z} from 'genkit';

const PositionSchema = z.object({
    asset: z.string(),
    side: z.enum(['Long', 'Short']),
    entryPrice: z.number(),
    pnl: z.number(),
    pnlPercentage: z.number(),
    leverage: z.number(),
    size: z.number(),
    liquidationPrice: z.number().nullable(),
    margin: z.number(),
});

const AnalyzePositionsInputSchema = z.object({
  positions: z.array(PositionSchema).describe("The user's open positions."),
  walletBalance: z.number().describe("The user's total wallet balance in USD."),
});
export type AnalyzePositionsInput = z.infer<typeof AnalyzePositionsInputSchema>;

const AnalyzePositionsOutputSchema = z.object({
    analysis: z.string().describe("A detailed analysis of the user's portfolio, including risk assessment, potential opportunities, and overall health. The analysis should be formatted in markdown."),
});
export type AnalyzePositionsOutput = z.infer<typeof AnalyzePositionsOutputSchema>;


export async function analyzePositions(input: AnalyzePositionsInput): Promise<AnalyzePositionsOutput> {
  return analyzePositionsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'analyzePositionsPrompt',
  input: {schema: AnalyzePositionsInputSchema},
  output: {schema: AnalyzePositionsOutputSchema},
  prompt: `You are a professional crypto trading analyst. Your task is to analyze the user's portfolio based on their open positions and overall wallet balance.

**User's Wallet Balance:** \${{walletBalance}}

**User's Open Positions:**
{{#each positions}}
- **{{asset}} ({{side}})**
  - PnL: \${{pnl}} ({{pnlPercentage}}%)
  - Size: \${{size}}
  - Leverage: {{leverage}}x
  - Entry Price: \${{entryPrice}}
  - Liquidation Price: \${{liquidationPrice}}
{{/each}}

Please provide a concise, markdown-formatted analysis covering the following points:
1.  **Overall Risk Assessment:** Evaluate the portfolio's risk level based on leverage, position concentration, and proximity to liquidation prices.
2.  **Key Observations:** Highlight the most profitable or riskiest positions.
3.  **Potential Recommendations:** Offer general advice, such as considering taking profits, reducing leverage on high-risk positions, or diversifying. Do not give specific financial advice to buy or sell any particular asset.
`,
});

const analyzePositionsFlow = ai.defineFlow(
  {
    name: 'analyzePositionsFlow',
    inputSchema: AnalyzePositionsInputSchema,
    outputSchema: AnalyzePositionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
