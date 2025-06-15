"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = require("./ws/binance");
const bybit_1 = require("./ws/bybit");
const arbitrage_1 = require("./logic/arbitrage");
const logger_1 = require("./utils/logger");
const arbitrageDetector = new arbitrage_1.ArbitrageDetector();
const binanceWs = new binance_1.BinanceWebSocket((symbol, price) => {
    arbitrageDetector.updatePrice('binance', symbol, price);
});
const bybitWs = new bybit_1.BybitWebSocket((symbol, price) => {
    arbitrageDetector.updatePrice('bybit', symbol, price);
});
// Handle graceful shutdown
process.on('SIGINT', () => {
    (0, logger_1.logInfo)('Shutting down...');
    binanceWs.disconnect();
    bybitWs.disconnect();
    process.exit(0);
});
// Start the arbitrage detection
(0, logger_1.logInfo)('Starting arbitrage detection...');
binanceWs.connect();
bybitWs.connect();
