const debug = require("debug"); debug("ChrezBot:MessageCreate");

import {MAX_MESSAGE_ALLOWED, BOT_PREFIXES, BOT_OWNER_ID} from "@config";
import {muted} from "@shared/isMute";
import * as sharedCommands from "@shared/commands";

import {EventArguments} from "../"
import { CommandBuilder, ErrorValidation, TemporaryArray } from "@library";
import { sendError } from "@bot";
import { Message } from "discord.js";
import { UserService } from "@services";
import { absoluteMuted } from "@shared/isAbsoluteMuted"

const holdUser = new TemporaryArray<string>([], (stra, strb) => stra === strb);

function commandValidation(message: Message<boolean>, command: string): CommandBuilder<any> | ErrorValidation{
    let chatCommand: CommandBuilder<any> | undefined = sharedCommands
            .allCommands
            .find((commandBuilder) => commandBuilder.checkIfCommand(command));

    if(chatCommand === undefined)
        return new ErrorValidation("chat_command_unavailable", command);

    if(chatCommand.status === "owner" && message.author.id !== BOT_OWNER_ID)
        return new ErrorValidation("command_is_owner_only");

    if(chatCommand.status === "private"){
        const userId = message.author.id;
        if(userId === undefined)
            return new ErrorValidation("command_user_not_found");
        else if(!UserService.userIsAdmin(userId))
            return new ErrorValidation("command_is_private");
    }

    return chatCommand;
}

const event: EventArguments<"messageCreate"> = ["messageCreate", async (message) => {
    if(!message.guild) return;

    // check if the bot can send message into the channel
    if(!message.guild.members.me?.permissions.has("ManageMessages")) return;
    
    // ignore message from bot or long message
    if(message.author.bot || message.content.length > MAX_MESSAGE_ALLOWED) return;

    // for absolute mute case
    if(absoluteMuted && message.author.id !== BOT_OWNER_ID){
        // if the user is not the owner, ignore the message
        return;
    }
    
    // inline command handling
    // ignore inline command if chrezbot is muted
    if(!muted && !holdUser.find((data) => data === message.author.id))
        for(const [v, k] of sharedCommands.aliasCriteriaMap){
            // this is special for function
            if(v instanceof Function){
                if(v(message)){
                    const command = sharedCommands.inlineCommands.get(k);
                    if(command){
                        command.execute(message);
                        holdUser.addData(message.author.id);
                        return;
                    }
                }
                
                continue;
            }

            if(
                (typeof v === "string" && message.content !== v) 
                || 
                (v instanceof RegExp && message.content.match(v) === null)
            )
                continue;
            
            const command = sharedCommands.inlineCommands.get(k);
            if(command){
                command.execute(message);
                holdUser.addData(message.author.id);
                return;
            }
        }
    
    // check if command is directed to chrezbot (e.g "Chrez" math) and its aliases
    if(BOT_PREFIXES.find(prefix => message.content.startsWith(prefix)) === undefined) 
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