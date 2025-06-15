import TelegramBot from 'node-telegram-bot-api';

// Replace with your actual bot token and chat ID
const TELEGRAM_BOT_TOKEN = '7024761079:AAFn6cezpe2nU_AZ05oUU0K-B1TjiGuoEes';
const TELEGRAM_CHAT_ID = '6092973639';

let bot: TelegramBot | null = null;

if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
}

export function sendTelegramMessage(message: string) {
  if (bot && TELEGRAM_CHAT_ID) {
    bot.sendMessage(TELEGRAM_CHAT_ID, message).catch((err: Error) => {
      // Optionally log error to console or file
      console.error('Failed to send Telegram message:', err.message);
    });
  }
} 