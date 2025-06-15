"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BybitWebSocket = void 0;
const ws_1 = __importDefault(require("ws"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class BybitWebSocket {
    constructor(onPriceUpdate) {
        this.onPriceUpdate = onPriceUpdate;
        this.ws = null;
        this.prices = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }
    connect() {
        this.ws = new ws_1.default(config_1.config.exchanges.bybit.wsUrl);
        this.ws.on('open', () => {
            (0, logger_1.logInfo)('Connected to Bybit WebSocket');
            this.reconnectAttempts = 0;
            this.subscribeToPairs();
        });
        this.ws.on('message', (data) => {
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
            }
            catch (error) {
                (0, logger_1.logError)(`Error processing Bybit message: ${error}`);
            }
        });
        this.ws.on('error', (error) => {
            (0, logger_1.logError)(`Bybit WebSocket error: ${error}`);
        });
        this.ws.on('close', () => {
            (0, logger_1.logInfo)('Bybit WebSocket connection closed');
            this.handleReconnect();
        });
    }
    subscribeToPairs() {
        const ws = this.ws;
        if (!ws) {
            (0, logger_1.logError)('Cannot subscribe: WebSocket is not connected');
            return;
        }
        // Subscribe to all pairs at once
        const subscribeMsg = {
            op: 'subscribe',
            args: config_1.config.pairs.map(pair => `tickers.${pair.toLowerCase()}`)
        };
        ws.send(JSON.stringify(subscribeMsg));
    }
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            (0, logger_1.logInfo)(`Attempting to reconnect to Bybit (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), 5000 * this.reconnectAttempts);
        }
        else {
            (0, logger_1.logError)('Max reconnection attempts reached for Bybit');
        }
    }
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    getPrice(symbol) {
        return this.prices.get(symbol);
    }
}
exports.BybitWebSocket = BybitWebSocket;
