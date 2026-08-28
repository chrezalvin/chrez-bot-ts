// idk why it wouldnt work on es6 import smh
const debug = require("debug")("ChrezBot:bot");

import { BOT_PREFIXES, MAX_MESSAGE_ALLOWED } from "@config";
import {chatMiddleware, slashMiddleware} from "./commandMiddlewares";
import {client} from "@shared/DiscordClient";

import { ChrezBot } from "@library/ChrezBot";

import { 
    chat_commands,
    slash_commands,
    inline_commands
} from "./commands";

const chrezBot = new ChrezBot(client);
chrezBot.useChat(chatMiddleware.excludeBot);
chrezBot.useChat(chatMiddleware.handleAbsoluteMute);
chrezBot.useChat(chatMiddleware.handleLongText(MAX_MESSAGE_ALLOWED));
chrezBot.useChat(chatMiddleware.inlineCommandHandler(inline_commands));
chrezBot.useChat(chatMiddleware.requireCommand(BOT_PREFIXES));
chrezBot.useChat(chatMiddleware.commandHandler(chat_commands));
chrezBot.useChat(chatMiddleware.errorHandler.errorValidationHandler);
chrezBot.useChat(chatMiddleware.errorHandler.postgresErrorHandler);
chrezBot.useChat(chatMiddleware.errorHandler.zodErrorHandler);
chrezBot.useChat(chatMiddleware.errorHandler.errorHandler);

chrezBot.useSlash(slashMiddleware.excludeBot);
chrezBot.useSlash(slashMiddleware.handleAbsoluteMute);
chrezBot.useSlash(slashMiddleware.commandHandler(slash_commands));
chrezBot.useSlash(slashMiddleware.errorHandler.errorValidationHandler);
chrezBot.useSlash(slashMiddleware.errorHandler.postgresErrorHandler);
chrezBot.useSlash(slashMiddleware.errorHandler.zodErrorHandler);
chrezBot.useSlash(slashMiddleware.errorHandler.errorHandler);

export {chrezBot};