// idk why it wouldnt work on es6 import smh
const debug = require("debug")("ChrezBot:bot");

import {DISCORD_TOKEN, MODE, botVersion, ownerID, prefixes} from "@config";
import { Client, Collection, DiscordAPIError, GatewayIntentBits, Interaction, TextChannel, version } from "discord.js";

import { CommandReturnTypes, inlineCommandReturnTypes, isDiscordAPIError } from "@typings/customTypes";
import commands, { inline } from "./commands/";
import { MyEmbedBuilder } from "@modules/basicFunctions";
import errorMessages from "@assets/data/error.json";
import profiles from "@assets/data/profiles.json";

import {CronJob} from "cron";

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
    _command.set(command.name, command);
    if(command.slash)
    _slashCommands.set(command.slash.slashCommand.name, command.slash);
    if(command.alias)
    for(const alias of command.alias){
        if(_commandAlias.has(alias)){
            console.warn(`WARNING: The alias ${alias} in Chrez ${command.name} has already been taken by command ${_commandAlias.get(alias)}, skipping this alias`);
            continue;
        }
        _commandAlias.set(alias, command.name);
    }
}
debug("Done loading active commands");

debug("Loading private commands");
for(const command of commands.c_private){
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
    console.log("On development mode, adding experimental commands");
    for(const command of commands.experimental.commands){
        _command.set(command.name, command);
        if(command.slash){
            console.log(command.slash.slashCommand.name);
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
debug(`slash Commands: ${_slashCommands.map((_, key) => key)}`);
debug(`inline Commands: ${_inlineCommands.map((_, key) => key)}`);
debug(`private Commands: ${_privateCommands.map((_, key) => key)}`);

export const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
]})

console.log(`Bot running on mode ${MODE}`);

client.once("ready", () => {
    console.log("Bot ready!");
    debug(`discord.js version: ${version}\nbot version: ${botVersion}`);
});

client.on("messageCreate", async (message) => {
    if(!message.guild?.members.me?.permissions.has("ManageMessages")) return;
    
    // ignore message from bot or long message
    if(message.author.bot || message.content.length > 300) return;
    
    // inline command handling
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
    
    if(prefixes.find(prefix => message.content.startsWith(prefix)) === undefined) 
    return;
    
    const args = message.content.split(/ +/);
    args.shift();
    
    debug(`got message: ${message.content}`);
    debug(`args: ${args}`);
    
    const command = args.shift();
    // check if command available
    if(command === undefined) return;
    
    try{
        if(_command.has(command))
        await _command.get(command)?.execute(message, args);
        else if(_commandAlias.has(command))
        await _command.get(_commandAlias.get(command)!)?.execute(message, args);
        else if(_privateCommands.has(command)){
            if(message.author.id === ownerID)
            await _privateCommands.get(command)?.execute(message, args);
            else
            throw new Error("This command is for private members only!");
        }
        else if(_privateCommandAlias.has(command)){
            if(message.author.id === ownerID)
            await _privateCommands.get(_privateCommandAlias.get(command)!)?.execute(message, args);
            else
            throw new Error("This command is for private members only!");
        }
        else
        throw new Error("Your command is not available in Chrez Command List");
    }
    catch(e: any){
        const embed = new MyEmbedBuilder();
        const deleteTime = 10;
        if(e.message && typeof e.message === "string")
        embed.setError({description: `**${e.message}**`, footer: "this message will be deleted in 10 seconds"});
        
        const msg = await message.channel.send({embeds: [embed]});
        setTimeout(() => {
            if(msg.deletable)
            msg.delete();
        }, deleteTime * 1000);
    }
})

async function sleep(ms: number){
    const p = new Promise<void>((res, _) => {
        setTimeout(() => {res()}, ms);
    })
    
    await p;
}

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    debug(`received interaction: /${interaction.commandName} from ${interaction.member?.user.username}`);
    
    try{
        if(_slashCommands.has(interaction.commandName))
        await _slashCommands.get(interaction.commandName)?.interact(interaction);
        else if(_privateSlashCommands.has(interaction.commandName)){
            if(!interaction.member) return;
            if(interaction.member.user.id === ownerID)
                await _privateSlashCommands.get(interaction.commandName)?.interact(interaction);
            else
                throw new Error("This command is for private members only!");
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
                debug(`got Error ${e.message}`);

                embed.setError({description: `**${e.message}**`, footer: "This message will be deleted within 10 seconds"});
                await interaction.reply({embeds: [embed]});

                setTimeout(async () => { 
                    await interaction.deleteReply();
                }, deleteTime * 1000);

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

// birthday responder
// name of month
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
console.log("Adding cronjobs");
for(const profile of profiles){
    if(profile.birthday){
        debug(`adding bday schedule for ${profile.name}`);
        const bday = profile.birthday;
        if(bday.day < 2){
            bday.day = 28; // assuming all month are 28 days lol
            --bday.month;
            if(bday.month === 0) bday.month = 12;
        }

        // 2 days from now
        // `0 8 ${bday.day} ${bday.month} *`
        new CronJob(`0 8 ${bday.day} ${bday.month} *`, async () => {
            // send to crystal phoenix
            const ch = await client.channels.fetch("739696962097512452");

            const embed = new MyEmbedBuilder({
                title: `Somone is having a bday at ${monthNames[profile.birthday.month - 1]} ${profile.birthday.day}`,
                description: "wonder who"
            })

            if(ch)
                await (ch as TextChannel).send({embeds: [embed]});
        }, null, true, "Japan");

        new CronJob(`0 8 ${profile.birthday.day} ${profile.birthday.month} *`, async () => {
            // send to crystal phoenix
            const ch = await client.channels.fetch("739696962097512452");

            const embed = new MyEmbedBuilder({
                title: `${profile.name} is having a birthday!`,
                description: `cool`
            })

            if(ch)
                await (ch as TextChannel).send({embeds: [embed]});
        }, null, true, "Japan");
    }
}
console.log("Sucessfully added cronjobs");

process.on("unhandledRejection", async (error, _) => {
    console.log(`fatal error: ${JSON.stringify(error)}`);
})

client.login(DISCORD_TOKEN);