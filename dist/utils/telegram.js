"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTelegramMessage = sendTelegramMessage;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
// Replace with your actual bot token and chat ID
const TELEGRAM_BOT_TOKEN = '7024761079:AAFn6cezpe2nU_AZ05oUU0K-B1TjiGuoEes';
const TELEGRAM_CHAT_ID = '6092973639';
let bot = null;
if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    bot = new node_telegram_bot_api_1.default(TELEGRAM_BOT_TOKEN, { polling: false });
}
function sendTelegramMessage(message) {
    if (bot && TELEGRAM_CHAT_ID) {
        bot.sendMessage(TELEGRAM_CHAT_ID, message).catch((err) => {
            // Optionally log error to console or file
            console.error('Failed to send Telegram message:', err.message);
        });
    }
}
