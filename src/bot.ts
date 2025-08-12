// idk why it wouldnt work on es6 import smh
const debug = require("debug")("ChrezBot:bot");

import { DISCORD_TOKEN } from "@config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import {
    handlePermission, 
    inlineHandler, 
    isCommand,
    isPrefix, 
    handleLongText,
    handleChatCommands, 
    handleAbsoluteMute,
    
    handleInteractionCommands, 
    excludeBotInteraction,
    interactionErrorHandler,
    handleSlashPermission,
    excludeBotChat,
    handleAbsoluteMuteInteraction,
} from "./commandMiddlewares";

import { ChrezBot } from "@library";
import { CustomArgs } from "./types/customArgs";

import autoWorkersList from "autoWorkers";
import { chatErrorHandler } from "commandMiddlewares/chat/chatErrorHandler";

export const client = new Client({
    partials: [Partials.Channel],
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
    ]}
);


debug("adding autoWorkers...");
for(const autoWorker of autoWorkersList)
    try{
        debug(`registering autoworker ${autoWorker.name}`);
        autoWorker(client);
        debug(`autoworker ${autoWorker.name} has been registered successfully`);
    }
    catch(e: unknown){
        if(typeof e === "object" && e !== null)
            if("message" in e){
                if (typeof e.message === "string" || Array.isArray(e.message))
                    console.error(`error at autoWorker ${autoWorker.name}: ${e.message}`);
            }
        else
            console.error(`unknown error at autoWorker ${autoWorker.name}`);
    }
debug("Sucessfully added autoWorkers");
debug(`list of active autoWorkers: ${autoWorkersList.map(w => w.name)}`);

process.on("unhandledRejection", async (error, _) => {
    if(error instanceof Error)
        console.log(`fatal error: ${error.message}`);
    else
        console.log(`fatal error: ${error}`);
})

client.login(DISCORD_TOKEN);

const chrezBot = new ChrezBot<CustomArgs>(client);
chrezBot.useChat(excludeBotChat);
chrezBot.useChat(handleAbsoluteMute);
chrezBot.useChat(handleLongText);
chrezBot.useChat(inlineHandler);
chrezBot.useChat(isPrefix);
chrezBot.useChat(isCommand);
chrezBot.useChat(handlePermission);
chrezBot.useChat(handleChatCommands);
chrezBot.useChat(chatErrorHandler);

chrezBot.useSlash(excludeBotInteraction);
chrezBot.useSlash(handleAbsoluteMuteInteraction);
chrezBot.useSlash(handleSlashPermission);
chrezBot.useSlash(handleInteractionCommands);
chrezBot.useSlash(interactionErrorHandler);

export default client;