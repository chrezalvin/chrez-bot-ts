import {MyEmbedBuilder} from "@library";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "test",
    description: "Tests the time delay",
    searchCriteria: ["test", "testing", "ping"],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    // get current time
    const timeMs = new Date().getMilliseconds();

    // get date message sent in ms
    const timeMessageMs = ctx.message.createdAt.getMilliseconds();
    
    const embed = new MyEmbedBuilder()
        .setTitle(`Test`)
        .setDescription(`Response time: ${Math.abs(timeMessageMs -  timeMs)}ms`);

    ctx.message.channel.send({embeds: [embed]});
};

export default {inline, middlewares: [execute]} as InlineCommand;