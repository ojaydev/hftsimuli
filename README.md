# Cross-Exchange Arbitrage Simulator

A real-time arbitrage opportunity detector that monitors price differences between Binance and Bybit exchanges.

## Features

- Real-time price monitoring for 20 trading pairs
- WebSocket connections to Binance and Bybit
- Configurable spread threshold and trade size
- Automatic reconnection handling
- Detailed logging of arbitrage opportunities

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hftsimuli
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

## Configuration

Edit `src/config.ts` to customize:
- Trading pairs
- Minimum spread threshold
- Trade size
- Exchange fees
- WebSocket URLs

## Usage

Start the simulator:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Output

The simulator will log arbitrage opportunities to both the console and `arbitrage.log` file in the following format:

```
[2024-03-14T12:34:56.789Z] Arbitrage Opportunity!
Pair: BTCUSDT
Buy on: Binance @ 67100.12
Sell on: Bybit   @ 67300.15
Spread: 0.298%
Net Profit: $178.50
```

## Architecture

- `src/config.ts`: Configuration settings
- `src/ws/`: WebSocket handlers for exchanges
- `src/logic/`: Arbitrage detection logic
- `src/utils/`: Logging utilities
- `src/index.ts`: Main application entry point

## Error Handling

- Automatic reconnection on connection loss
- Maximum reconnection attempts to prevent infinite loops
- Detailed error logging

## License

MIT 