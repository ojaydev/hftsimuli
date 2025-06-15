"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceWebSocket = void 0;
const ws_1 = __importDefault(require("ws"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class BinanceWebSocket {
    constructor(onPriceUpdate) {
        this.onPriceUpdate = onPriceUpdate;
        this.ws = null;
        this.prices = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }
    connect() {
        // Create streams string for all pairs
        const streams = config_1.config.pairs.map(pair => `${pair.toLowerCase()}@ticker`).join('/');
        const wsUrl = `${config_1.config.exchanges.binance.wsUrl}${streams}`;
        (0, logger_1.logInfo)(`Connecting to Binance WebSocket with URL: ${wsUrl}`);
        this.ws = new ws_1.default(wsUrl);
        this.ws.on('open', () => {
            (0, logger_1.logInfo)('Connected to Binance WebSocket');
            this.reconnectAttempts = 0;
        });
        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                (0, logger_1.logInfo)(`Received Binance message: ${JSON.stringify(message)}`);
                if (message.data) {
                    const symbol = message.data.s;
                    const price = parseFloat(message.data.c);
                    this.prices.set(symbol, price);
                    this.onPriceUpdate(symbol, price);
                    (0, logger_1.logInfo)(`Updated Binance price for ${symbol}: ${price}`);
                }
            }
            catch (error) {
                (0, logger_1.logError)(`Error processing Binance message: ${error}`);
            }
        });
        this.ws.on('error', (error) => {
            (0, logger_1.logError)(`Binance WebSocket error: ${error}`);
        });
        this.ws.on('close', () => {
            (0, logger_1.logInfo)('Binance WebSocket connection closed');
            this.handleReconnect();
        });
    }
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            (0, logger_1.logInfo)(`Attempting to reconnect to Binance (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), 5000 * this.reconnectAttempts);
        }
        else {
            (0, logger_1.logError)('Max reconnection attempts reached for Binance');
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
exports.BinanceWebSocket = BinanceWebSocket;
