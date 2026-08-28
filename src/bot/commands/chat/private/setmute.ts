import { MyEmbedBuilder } from "@library";
import { setMute } from "@services/discord/private";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { ChatCommand } from "@commands/types";
import { chatMiddleware } from "@bot/commandMiddlewares";

const chat = new ChatCommandBuilder({
    name: "mute",
    alias: ["stfu", "shutup", "off", "shoo", "sshh"],
    description: "mutes chrezbot's inline command"
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const muted = ctx.args[0] === "false" ? false : true;
    const onUnmuted = () => {
        ctx.message.channel.send({embeds: [new MyEmbedBuilder({description: "Chrezbot is now unmuted"})]});
    }
    const res = setMute({mute: muted}, onUnmuted);
    
    await ctx.message.channel.send(res);
}

export default {
    chat, 
    middlewares: [
        chatMiddleware.requireDiscordUser({roles: ["owner", "admin", "vice"]}), 
        execute,
    ]
} as ChatCommand;