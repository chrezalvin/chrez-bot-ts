const debug = require("debug"); debug("ChrezBot:MessageCreate");

import {max_message_allowed, muted, prefixes} from "@config";
import * as sharedCommands from "shared/commands";

import {EventArguments} from "../"
import { CommandBuilder } from "@library/CommandBuilder";
import { userIsAdmin } from "library/profiles";
import { sendError } from "@bot";
import { Message } from "discord.js";
import { ErrorValidation } from "@library/ErrorValidation";

function commandValidation(message: Message<boolean>, command: string): CommandBuilder<any> | ErrorValidation{
    let chatCommand: CommandBuilder<any> | undefined = sharedCommands
            .allCommands
            .find((commandBuilder) => commandBuilder.checkIfCommand(command));

    if(chatCommand === undefined)
        return new ErrorValidation("chat_command_unavailable", command);

    if(chatCommand.status === "private"){
        const userId = message.author.id;
        if(userId === undefined)
            return new ErrorValidation("command_user_not_found");
        else if(!userIsAdmin(userId))
            return new ErrorValidation("command_is_private");
    }

    return chatCommand;
}

const event: EventArguments<"messageCreate"> = ["messageCreate", async (message) => {
    if(!message.guild) return;

    // check if the bot can send message into the channel
    if(!message.guild.members.me?.permissions.has("ManageMessages")) return;
    
    // ignore message from bot or long message
    if(message.author.bot || message.content.length > max_message_allowed) return;
    
    // inline command handling
    // ignore inline command if chrezbot is muted
    if(!muted)
        for(const [v, k] of sharedCommands.aliasCriteriaMap){
            if(typeof v === "string")
            if(message.content === v){
                sharedCommands.inlineCommands.get(k)?.execute(message);
                return;
            }
            if(v instanceof RegExp)
            if(message.content.match(v) !== null){
                sharedCommands.inlineCommands.get(k)?.execute(message);
                return;
            }
        }
    
    // check if command is directed to chrezbot (e.g "Chrez" math) and its aliases
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
        const chatCommand = commandValidation(message, command);
        if(ErrorValidation.isErrorValidation(chatCommand))
            return await ErrorValidation.sendErrorValidation(message, chatCommand);

        const res = await chatCommand.execute(message, args);
        if(ErrorValidation.isErrorValidation(res))
            return await ErrorValidation.sendErrorValidation(message, res);
    }
    catch(e: unknown){
        debug(`error: ${e}`);

        // check if error can be send through discord
        if(!message.channel) return;

        let errorMsg: string = "";
        if(typeof e === "string")
            errorMsg = e;
        else if(e && typeof e === "object" && "message" in e && typeof e.message === "string")
            errorMsg = e.message;
        else
            errorMsg = "unknown error occured";

        await sendError(message, errorMsg);
    }
}]

export default event;