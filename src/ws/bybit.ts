import WebSocket from 'ws';
import { config } from '../config';
import { logError, logInfo } from '../utils/logger';

export class BybitWebSocket {
  private ws: WebSocket | null = null;
  private prices: Map<string, number> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private onPriceUpdate: (symbol: string, price: number) => void) {}

  connect() {
    this.ws = new WebSocket(config.exchanges.bybit.wsUrl);

    this.ws.on('open', () => {
      logInfo('Connected to Bybit WebSocket');
      this.reconnectAttempts = 0;
      this.subscribeToPairs();
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Handle subscription confirmation
        if (message.success) {
          return;
        }

        // Handle ticker data
        if (message.topic?.startsWith('tickers.')) {
          const symbol = message.topic.split('.')[1].toUpperCase();
          const price = parseFloat(message.data.lastPrice);
          this.prices.set(symbol, price);
          this.onPriceUpdate(symbol, price);
        }
      } catch (error) {
        logError(`Error processing Bybit message: ${error}`);
      }
    });

    this.ws.on('error', (error) => {
      logError(`Bybit WebSocket error: ${error}`);
    });

    this.ws.on('close', () => {
      logInfo('Bybit WebSocket connection closed');
      this.handleReconnect();
    });
  }

  private subscribeToPairs() {
    const ws = this.ws;
    if (!ws) {
      logError('Cannot subscribe: WebSocket is not connected');
      return;
    }

    // Subscribe to all pairs at once
    const subscribeMsg = {
      op: 'subscribe',
      args: config.pairs.map(pair => `tickers.${pair.toLowerCase()}`)
    };
    ws.send(JSON.stringify(subscribeMsg));
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      logInfo(`Attempting to reconnect to Bybit (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), 5000 * this.reconnectAttempts);
    } else {
      logError('Max reconnection attempts reached for Bybit');
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