const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
require("dotenv").config();

const { BOT_TOKEN } = process.env;

const bot = new TelegramApi(BOT_TOKEN, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "I'm going to pick a random number between 0 and 9, and you have to guess it."
  );

  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, "Guess", gameOptions);
};

const start = async () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Greeting",
    },
    {
      command: "/info",
      description: "Get information about user",
    },
    {
      command: "/game",
      description: "Game guess a number",
    },
  ]);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp"
      );
      return bot.sendMessage(chatId, `Welcome to Georgii Budik telegram bot`);
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Your name is ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Sorry, I don't understand you");
  });

  bot.on("callback_query", async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;

    if (data === "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Congratulations! You guessed the number ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `You did not guess the number :(, bot picked ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
