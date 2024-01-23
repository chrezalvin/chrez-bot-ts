// idk why it wouldnt work on es6 import smh
const debug = require("debug")("ChrezBot:bot");

import {DISCORD_TOKEN} from "@config";
import {CacheType, ChatInputCommandInteraction, Client, GatewayIntentBits, Message } from "discord.js";

import { isChatInputCommandInteraction } from "@typings/customTypes";
import { MyEmbedBuilder } from "@modules/basicFunctions";

import events from "./events";

import autoWorkersList from "autoWorkers";

export const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
]})

for(const botEvent of events){
    for(const execute of botEvent.execute){
        debug(`created event ${botEvent.name} ${execute[0]}`);
        client[botEvent.name](...execute);
    }
}

export async function sendError(
        message: Message<boolean> | ChatInputCommandInteraction<CacheType>,
        errorMessage: string,
        deleteTime: number | null = 10,
    ){
    const embed = new MyEmbedBuilder();
    embed.setError({description: `**${errorMessage}**`, footer: `this message will be deleted in ${deleteTime} seconds`});

    if(isChatInputCommandInteraction(message)){
        message.deferred ? await message.editReply({embeds: [embed]}) : await message.reply({embeds: [embed]});
        if(deleteTime)
            setTimeout(async () => {
                message.deleteReply();
            }, deleteTime * 1000);
    }
    else{
        const msg = await message.channel.send({embeds: [embed]});
        if(deleteTime) 
            setTimeout(async () => {
                if(msg.deletable)
                    await msg.delete();
            }, deleteTime * 1000);
    }
}

debug("adding autoWorkers...");
for(const autoWorker of autoWorkersList)
    try{
        autoWorker(client);
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
    console.log(`fatal error: ${JSON.stringify(error)}`);
})

client.login(DISCORD_TOKEN);

export default client;