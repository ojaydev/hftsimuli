"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInfo = exports.logError = exports.logOpportunity = void 0;
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        new winston_1.default.transports.File({ filename: 'arbitrage.log' })
    ]
});
const logOpportunity = (opportunity) => {
    const message = `
[${opportunity.timestamp.toISOString()}] Arbitrage Opportunity!
Pair: ${opportunity.pair}
Buy on: ${opportunity.buyExchange} @ ${opportunity.buyPrice}
Sell on: ${opportunity.sellExchange} @ ${opportunity.sellPrice}
Spread: ${opportunity.spread.toFixed(4)}%
Net Profit: $${opportunity.netProfit.toFixed(2)}
`;
    logger.info(message);
};
exports.logOpportunity = logOpportunity;
const logError = (error) => {
    logger.error(error);
};
exports.logError = logError;
const logInfo = (message) => {
    logger.info(message);
};
exports.logInfo = logInfo;
