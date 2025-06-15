"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArbitrageDetector = void 0;
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class ArbitrageDetector {
    constructor() {
        this.binancePrices = new Map();
        this.bybitPrices = new Map();
    }
    updatePrice(exchange, symbol, price) {
        if (exchange === 'binance') {
            this.binancePrices.set(symbol, price);
        }
        else {
            this.bybitPrices.set(symbol, price);
        }
        this.checkArbitrage(symbol);
    }
    checkArbitrage(symbol) {
        const binancePrice = this.binancePrices.get(symbol);
        const bybitPrice = this.bybitPrices.get(symbol);
        if (!binancePrice || !bybitPrice)
            return;
        // Check Binance -> Bybit arbitrage
        if (binancePrice < bybitPrice) {
            const spread = ((bybitPrice - binancePrice) / binancePrice) * 100;
            if (spread > config_1.config.threshold) {
                const grossProfit = bybitPrice - binancePrice;
                const fee = config_1.config.tradeSize * config_1.config.feeRate * 2; // buy + sell
                const netProfit = (grossProfit * config_1.config.tradeSize) - fee;
                const opportunity = {
                    timestamp: new Date(),
                    pair: symbol,
                    buyExchange: 'Binance',
                    sellExchange: 'Bybit',
                    buyPrice: binancePrice,
                    sellPrice: bybitPrice,
                    spread,
                    netProfit
                };
                (0, logger_1.logOpportunity)(opportunity);
            }
        }
        // Check Bybit -> Binance arbitrage
        else if (bybitPrice < binancePrice) {
            const spread = ((binancePrice - bybitPrice) / bybitPrice) * 100;
            if (spread > config_1.config.threshold) {
                const grossProfit = binancePrice - bybitPrice;
                const fee = config_1.config.tradeSize * config_1.config.feeRate * 2; // buy + sell
                const netProfit = (grossProfit * config_1.config.tradeSize) - fee;
                const opportunity = {
                    timestamp: new Date(),
                    pair: symbol,
                    buyExchange: 'Bybit',
                    sellExchange: 'Binance',
                    buyPrice: bybitPrice,
                    sellPrice: binancePrice,
                    spread,
                    netProfit
                };
                (0, logger_1.logOpportunity)(opportunity);
            }
        }
    }
}
exports.ArbitrageDetector = ArbitrageDetector;
