import { BinanceWebSocket } from './ws/binance';
import { BybitWebSocket } from './ws/bybit';
import { ArbitrageDetector } from './logic/arbitrage';
import { logInfo } from './utils/logger';

const arbitrageDetector = new ArbitrageDetector();

const binanceWs = new BinanceWebSocket((symbol, price) => {
  arbitrageDetector.updatePrice('binance', symbol, price);
});

const bybitWs = new BybitWebSocket((symbol, price) => {
  arbitrageDetector.updatePrice('bybit', symbol, price);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  logInfo('Shutting down...');
  binanceWs.disconnect();
  bybitWs.disconnect();
  process.exit(0);
});

// Start the arbitrage detection
logInfo('Starting arbitrage detection...');
binanceWs.connect();
bybitWs.connect(); 