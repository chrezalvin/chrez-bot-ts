const debug = require("debug"); debug("ChrezBot:MessageCreate");

import {max_message_allowed, muted, prefixes} from "@config";
import * as sharedCommands from "shared/commands";

import {EventArguments} from "../"
import { CommandBuilder } from "@modules/CommandBuilder";
import { userIsAdmin } from "@modules/profiles";
import { Cause } from "@typings/customTypes";
import { sendError } from "@bot";

const event: EventArguments<"messageCreate"> = ["messageCreate", async (message) => {
    if(!message.guild) return;

    // check if the bot can send message into the channel
    if(!message.guild.members.me?.permissions.has("ManageMessages")) return;
    
    // ignore message from bot or long message
    if(message.author.bot || message.content.length > max_message_allowed) return;
    
    // inline command handling
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
        if(sharedCommands.allCommands.has(command)){
            const chatCommand = sharedCommands.allCommands.get(command)!;

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
        try{
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
        catch(e: unknown){
            // this catch is last resport if fatal error occured
            console.log(`fatal error: ${JSON.stringify(e)}`);
        }
    }
}]

export default event;