import { config } from '../config';
import { logOpportunity, ArbitrageOpportunity } from '../utils/logger';

export class ArbitrageDetector {
  private binancePrices: Map<string, number> = new Map();
  private bybitPrices: Map<string, number> = new Map();

  updatePrice(exchange: 'binance' | 'bybit', symbol: string, price: number) {
    if (exchange === 'binance') {
      this.binancePrices.set(symbol, price);
    } else {
      this.bybitPrices.set(symbol, price);
    }
    this.checkArbitrage(symbol);
  }

  private checkArbitrage(symbol: string) {
    const binancePrice = this.binancePrices.get(symbol);
    const bybitPrice = this.bybitPrices.get(symbol);

    if (!binancePrice || !bybitPrice) return;

    // Check Binance -> Bybit arbitrage
    if (binancePrice < bybitPrice) {
      const spread = ((bybitPrice - binancePrice) / binancePrice) * 100;
      if (spread > config.threshold) {
        const grossProfit = bybitPrice - binancePrice;
        const fee = config.tradeSize * config.feeRate * 2; // buy + sell
        const netProfit = (grossProfit * config.tradeSize) - fee;

        const opportunity: ArbitrageOpportunity = {
          timestamp: new Date(),
          pair: symbol,
          buyExchange: 'Binance',
          sellExchange: 'Bybit',
          buyPrice: binancePrice,
          sellPrice: bybitPrice,
          spread,
          netProfit
        };

        logOpportunity(opportunity);
      }
    }
    // Check Bybit -> Binance arbitrage
    else if (bybitPrice < binancePrice) {
      const spread = ((binancePrice - bybitPrice) / bybitPrice) * 100;
      if (spread > config.threshold) {
        const grossProfit = binancePrice - bybitPrice;
        const fee = config.tradeSize * config.feeRate * 2; // buy + sell
        const netProfit = (grossProfit * config.tradeSize) - fee;

        const opportunity: ArbitrageOpportunity = {
          timestamp: new Date(),
          pair: symbol,
          buyExchange: 'Bybit',
          sellExchange: 'Binance',
          buyPrice: bybitPrice,
          sellPrice: binancePrice,
          spread,
          netProfit
        };

        logOpportunity(opportunity);
      }
    }
  }
} 