// idk why it wouldnt work on es6 import smh
const debug = require("debug")("ChrezBot:bot");

import {DISCORD_TOKEN, MODE, botVersion, ownerID, prefixes, max_message_allowed, trustedID, muted} from "@config";
import {CacheType, ChatInputCommandInteraction, Client, Collection, CommandInteraction, GatewayIntentBits, Message, version } from "discord.js";
import errorMessages from "@assets/data/error.json";

import { Cause, CommandReturnTypes, inlineCommandReturnTypes, isChatInputCommandInteraction, isDiscordAPIError } from "@typings/customTypes";
import commands from "./commands/";
import { MyEmbedBuilder } from "@modules/basicFunctions";

import autoWorkersList from "autoWorkers";
import { userIsAdmin } from "@modules/profiles";
import { CommandBuilder, CommandStatus } from "@modules/CommandBuilder";

const allCommandList = new Collection<string, CommandBuilder<any>>();

for(const command of [...commands.active, ...commands.c_private]){
    if(CommandBuilder.isCommandBuilder(command))
        allCommandList.set(command.name, command);
}

if(MODE === "development"){
    debug("adding experimental commands");
    for(const command of [...commands.experimental.commands]){
        if(CommandBuilder.isCommandBuilder(command))
            allCommandList.set(command.name, command);
    }
    debug("Sucessfully added experimental commands");
}

const _command = new Collection<string, CommandReturnTypes>();
const _commandAlias = new Collection<string, string>();
const _slashCommands = new Collection<string, CommandReturnTypes["slash"]>();

const _privateCommands = new Collection<string, CommandReturnTypes>();
const _privateCommandAlias = new Collection<string, string>();
const _privateSlashCommands = new Collection<string, CommandReturnTypes["slash"]>();

const _aliasCriteriaMap = new Collection<string|RegExp, string>();
const _inlineCommands= new Collection<string, inlineCommandReturnTypes>();

debug("Loading active commands");
for(const command of commands.active){
    if(CommandBuilder.isCommandBuilder(command)) continue;

    _command.set(command.name, command);
    if(command.slash)
        _slashCommands.set(command.slash.slashCommand.name, command.slash);
    if(command.alias)
        for(const alias of command.alias){
            if(_commandAlias.has(alias)){
                console.warn(`WARNING: The alias ${alias} in Chrez ${command.name} has already been taken by command ${_commandAlias.get(alias)}. This command will NOT be overriden, skipping this alias`);
                continue;
            }
            _commandAlias.set(alias, command.name);
        }
}
debug("Done loading active commands");

debug("Loading private commands");
for(const command of commands.c_private){
    if(CommandBuilder.isCommandBuilder(command)) continue;

    _privateCommands.set(command.name, command);
    if(command.slash)
        _privateSlashCommands.set(command.slash.slashCommand.name, command.slash);
    if(command.alias)
        for(const alias of command.alias){
            if(_privateCommandAlias.has(alias)){
                console.warn(`WARNING: The alias for private command ${alias} has already been taken by command ${_privateCommandAlias.get(alias)}, skipping this alias`);
                continue;
            }
            _privateCommandAlias.set(alias, command.name);
        }
}
debug("Done loading private commands");

debug("Loading Inline Commands");
for(const inline of commands.inline){
    for(const criteria of inline.searchCriteria)
        _aliasCriteriaMap.set(criteria, inline.name);
        _inlineCommands.set(inline.name, inline);
}
debug("Done loading inline Commands");

if(MODE === "development"){
    debug("On development mode, adding experimental commands");
    for(const command of commands.experimental.commands){
        if(CommandBuilder.isCommandBuilder(command)) continue;

        _command.set(command.name, command);
        if(command.slash){
            debug(`registering /${command.slash.slashCommand.name}`);
            _slashCommands.set(command.slash.slashCommand.name, command.slash);
        }
        if(command.alias)
        for(const alias of command.alias){
            if(_commandAlias.has(alias)){
                console.warn(`WARNING: The alias for command ${alias} has already been taken by command ${_commandAlias.get(alias)}, skipping this alias`);
                continue;
            }
            _commandAlias.set(alias, command.name);
        }
    }
    
    for(const inline of commands.experimental.inlines){
        for(const criteria of inline.searchCriteria)
            _aliasCriteriaMap.set(criteria, inline.name);
        _inlineCommands.set(inline.name, inline);
    }
    debug("Done loading experimental commands");
}

debug("======= list of commands =======");
debug(`create Message: ${_command.map((_, key) => key)}`);
debug(`slash Commands: ${_slashCommands.map((_, key) => `/${key} `)}`);
debug(`inline Commands: ${_inlineCommands.map((_, key) => key)}`);
debug(`private Commands: ${_privateCommands.map((_, key) => key)}`);

export const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
]})

async function sendError(
        message: Message<boolean> | ChatInputCommandInteraction<CacheType>,
        errorMessage: string,
        deleteTime: number | null = 10,
    ){
    const embed = new MyEmbedBuilder();
    embed.setError({description: `**${errorMessage}**`, footer: `this message will be deleted in ${deleteTime} seconds`});
    

    if(isChatInputCommandInteraction(message)){
        const msg = await message.reply({embeds: [embed], ephemeral: true});
            if(deleteTime && msg) 
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

client.once("ready", (_) => {
    console.log(`Bot ready! running on mode ${MODE}`);
    debug(`discord.js version: ${version}\nbot version: ${botVersion}`);
});

client.on("messageCreate", async (message) => {
    if(!message.guild) return;

    // check if the bot can send message into the channel
    if(!message.guild.members.me?.permissions.has("ManageMessages")) return;
    
    // ignore message from bot or long message
    if(message.author.bot || message.content.length > max_message_allowed) return;
    
    // inline command handling
    if(!muted)
    for(const [v, k] of _aliasCriteriaMap){
        if(typeof v === "string")
        if(message.content === v){
            _inlineCommands.get(k)?.execute(message);
            return;
        }
        if(v instanceof RegExp)
        if(message.content.match(v) !== null){
            _inlineCommands.get(k)?.execute(message);
            return;
        }
    }
    
    // check if command is directed to chrezbot (e.g "Chrez" math)
    if(prefixes.find(prefix => message.content.startsWith(prefix)) === undefined) 
    return;
    
    /**
     * argument variables, guaranteed lowercase and command removed
     */
    const args: string[] = message.content.split(/ +/);
    args.shift(); // remove command name (Chrez)
    
    debug(`got message: ${message.content}`);
    debug(`args: ${args}`);
    
    // check if command available (i.e: not just Chrez tho it should be alr guarded with inline command)
    const command = args.shift();
    // change args to lowercase
    args.forEach((str, index, arr) => arr[index] = str.toLowerCase());
    if(command === undefined) return;

    try{
        // check command
        if(_command.has(command))
            await _command.get(command)?.execute(message, args);
        // check alias for command
        else if(_commandAlias.has(command))
            _command.get(_commandAlias.get(command)!)?.execute(message, args);
        // check if command is for private members (highest authority)
        else if(_privateCommands.has(command)){
            if(message.author.id === ownerID || userIsAdmin(message.author.id))
                await _privateCommands.get(command)?.execute(message, args);
            else
                throw new Error("This command is for private members only!");
        }
        // check if command is for private members (lower authority)
        else if(_privateCommandAlias.has(command)){
            if(message.author.id === ownerID || userIsAdmin(message.author.id))
                await _privateCommands.get(_privateCommandAlias.get(command)!)?.execute(message, args);
            else
                throw new Error("This command is for private members only!");
        }
        else if(allCommandList.has(command)){
            const chatCommand = allCommandList.get(command)!;

            if(CommandBuilder.isCommandBuilder(chatCommand)){
                if(chatCommand.status === "private"){
                    const userId = message.author.id;
                    if(userId === undefined){
                        await sendError(message, "Cannot verify the sender of this command!");
                        return;
                    }
                    else if(!userIsAdmin(userId)){
                        await sendError(message, "This command is only available for private members!");
                        return;
                    }
                }

                const res = await chatCommand.execute(message, args);
                if(Cause.isCause(res) && !res.ok)
                    sendError(message, res.message);
                        
            }
        }
        else
            throw new Error("Your command is not available in Chrez Command List");
    }
    catch(e: unknown){
        debug(`error: ${e}`);

        // check if error can be send through discord
        if(!message.channel) return;

        if(e != null && typeof e === "object")
            if("message" in e && typeof e.message === "string")
                sendError(message, e.message);
            else if(typeof e == "string")
                sendError(message, e);
            else
                sendError(message, "Unknown error occured");
        else
            sendError(message, "Unknown error occured");
    }
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    debug(`received interaction: /${interaction.commandName} from ${interaction.member?.user.username}`);
    
    try{
        if(_slashCommands.has(interaction.commandName))
            await _slashCommands.get(interaction.commandName)?.interact(interaction);
        else if(_privateSlashCommands.has(interaction.commandName)){
            if(!interaction.member) return;
                if(interaction.member.user.id === ownerID || userIsAdmin(interaction.member.user.id))
                    await _privateSlashCommands.get(interaction.commandName)?.interact(interaction);
            else
                throw new Error("This command is for private members only!");
        }
        if(allCommandList.has(interaction.commandName)){
            const slashCommand = allCommandList.get(interaction.commandName)!;

            if(CommandBuilder.isCommandBuilder(slashCommand)){
                if(slashCommand.status === "private"){
                    const userId = interaction.member?.user.id;
                    if(userId === undefined){
                        await sendError(interaction, "Cannot verify the sender of this command!");
                        return;
                    }
                    else if(!userIsAdmin(userId)){
                        await sendError(interaction, "This command is only available for private members!");
                        return;
                    }
                }
            }

            const res = await slashCommand.execute(interaction);
            if(Cause.isCause(res) && !res.ok)
                sendError(interaction, res.message);
        }
        else{
            const embed = new MyEmbedBuilder();
            embed.setError({description: `The slash command is still unavailable!`, footer: "please wait for upcoming release to use this command"});
            await interaction.reply({embeds: [embed]});
        }
    }
    catch(e: unknown){
        const embed = new MyEmbedBuilder();
        const deleteTime = 10;
        
        if(isDiscordAPIError(e)){
            debug(`got DiscordAPIError code ${e.code}: ${e.message}`);
            const discordAPIError = e;
            const found = errorMessages.find(err => discordAPIError.code == err.errorcode);
            
            if(found === undefined)
                embed.setError({
                    description: "Encountered an unknown error!",
                    footer: "this message will be deleted in 10 seconds"
                });
            else
                embed.setError({
                    description: `${found.description}\ncode: ${found.errorcode}`,
                    title: `error: ${found.errorInfo}`,
                    footer: "this message will be deleted in 10 seconds"
                });
            
        }
        else{
            if(typeof e === "object" && 
                e !== null &&
                "message" in e &&
                typeof e.message === "string"
            ){
                // check if error can be send through discord
                if(!interaction.channel) return;

                if(e != null && typeof e === "object")
                    if("message" in e && typeof e.message === "string")
                        sendError(interaction, e.message);
                    else if(typeof e == "string")
                        sendError(interaction, e);
                    else
                        sendError(interaction, "Unknown error occured");
                else
                    sendError(interaction, "Unknown error occured");

                return;
            }
            else{
                console.log(`Unknown error ${e}`);
                return;
            }
        }

        if(interaction.channel){
            const get = await interaction.channel.send({embeds: [embed]});
            setTimeout(async () => {
                if(get.deletable) 
                await get.delete();
            }, deleteTime * 1000);
        }
        else console.log("Can't find any channel to send the message");
    }
});

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