import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'arbitrage.log' })
  ]
});

export interface ArbitrageOpportunity {
  timestamp: Date;
  pair: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  netProfit: number;
}

export const logOpportunity = (opportunity: ArbitrageOpportunity) => {
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

export const logError = (error: string) => {
  logger.error(error);
};

export const logInfo = (message: string) => {
  logger.info(message);
}; 