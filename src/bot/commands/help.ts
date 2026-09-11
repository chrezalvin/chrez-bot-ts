import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChatContext, ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { ChatCommand, SlashCommand } from "./types";
import { help, helpDetail } from "@services/discord/help";
import { SlashCommandBuilder } from "discord.js";

export function chrezHelp(
    activeChatCommands: ChatCommandBuilder[],
    privateChatCommands: ChatCommandBuilder[]
){
    
    const chat = new ChatCommandBuilder({
        name: "help",
        alias: ["h", "manual"],
        description: "give all commands for chrezbot",
        examples: []
    });

    activeChatCommands = [...activeChatCommands, chat]

    const slash = new SlashCommandBuilder()
            .setName("help")
            .setDescription("give all commands for chrezbot or specify which command to check")
            .addStringOption(opt => {
                opt.setName("command").setDescription("command to check");
                
                for(const idx of activeChatCommands)
                    opt.addChoices({name: `${BOT_PREFIXES[0]} ${idx.name}`, value: idx.name})

                return opt;
            });

    const chatCommandExecute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
        let embed;

        if(ctx.args[0] === "private"){
            if(ctx.args[1] === undefined)
                embed = await help({
                    chatCommands: privateChatCommands
                })
            else{
                const command = ctx.args[1];
                const found = privateChatCommands.find(e => e.checkIfCommand(command));

                if(!found)
                    return next("command not found!");

                embed = await helpDetail({
                    chatCommand: found
                });
            }
        }
        else{
            if(ctx.args[0] === undefined)
                embed = await help({
                    chatCommands: activeChatCommands
                })
            else{
                const command = ctx.args[0];
                const found = activeChatCommands.find(e => e.checkIfCommand(command));
    
                if(!found)
                    return next("command not found!");
    
                embed = await helpDetail({
                    chatCommand: found
                });
            }
        }

        ctx.message.channel.send(embed);
    }

    const slashCommandExecute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next) => {
        const command = ctx.chatInteraction.options.getString("command", false);

        let embed;
        if(command){
            const found = privateChatCommands.find(e => e.checkIfCommand(command));

            if(!found)
                return next("command not found!");

            embed = await helpDetail({chatCommand: found});
        }
        else
            embed = await help({chatCommands: activeChatCommands})

        ctx.chatInteraction.reply(embed);
    }

    return {
        chat: {chat, middlewares: [chatCommandExecute]} as ChatCommand,
        slash: {slash, middlewares: [slashCommandExecute]} as SlashCommand,
    };
}