import WebSocket from 'ws';
import { config } from '../config';
import { logError, logInfo } from '../utils/logger';

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private prices: Map<string, number> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private onPriceUpdate: (symbol: string, price: number) => void) {}

  connect() {
    // Create streams string for all pairs
    const streams = config.pairs.map(pair => `${pair.toLowerCase()}@ticker`).join('/');
    const wsUrl = `${config.exchanges.binance.wsUrl}${streams}`;
    
    logInfo(`Connecting to Binance WebSocket with URL: ${wsUrl}`);
    this.ws = new WebSocket(wsUrl);

    this.ws.on('open', () => {
      logInfo('Connected to Binance WebSocket');
      this.reconnectAttempts = 0;
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString());
        logInfo(`Received Binance message: ${JSON.stringify(message)}`);
        
        if (message.data) {
          const symbol = message.data.s;
          const price = parseFloat(message.data.c);
          this.prices.set(symbol, price);
          this.onPriceUpdate(symbol, price);
          logInfo(`Updated Binance price for ${symbol}: ${price}`);
        }
      } catch (error) {
        logError(`Error processing Binance message: ${error}`);
      }
    });

    this.ws.on('error', (error) => {
      logError(`Binance WebSocket error: ${error}`);
    });

    this.ws.on('close', () => {
      logInfo('Binance WebSocket connection closed');
      this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      logInfo(`Attempting to reconnect to Binance (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), 5000 * this.reconnectAttempts);
    } else {
      logError('Max reconnection attempts reached for Binance');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getPrice(symbol: string): number | undefined {
    return this.prices.get(symbol);
  }
} 