export const config = {
  pairs: [
    'BTCUSDT',
    'ETHUSDT',
    'SOLUSDT',
    'XRPUSDT',
    'LINKUSDT',
    'DOTUSDT',
    'ADAUSDT',
    'AVAXUSDT',
    'MATICUSDT',
    'DOGEUSDT',
    'SHIBUSDT',
    'UNIUSDT',
    'ATOMUSDT',
    'LTCUSDT',
    'BCHUSDT',
    'XLMUSDT',
    'ALGOUSDT',
    'NEARUSDT',
    'ICPUSDT',
    'FILUSDT'
  ],
  threshold: 0.25, // Minimum spread percentage
  tradeSize: 1000, // Trade size in USDT
  feeRate: 0.001, // 0.1% per trade
  exchanges: {
    binance: {
      wsUrl: 'wss://stream.binance.com:9443/stream?streams=',
      restUrl: 'https://api.binance.com'
    },
    bybit: {
      wsUrl: 'wss://stream.bybit.com/v5/public/spot',
      restUrl: 'https://api.bybit.com'
    }
  }
}; 