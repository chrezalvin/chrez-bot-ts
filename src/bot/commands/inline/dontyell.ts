import {rngInt} from "@library";
import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const dontYellMessages = [
    "Don't yell D:",
    "Don't yell please",
    "Don't yell DDDD::::",
    "Stop yelling D:",
    "Please Don't yell :(",
    "Stop yelling DDDD::::"
]

const inline = new InlineCommandBuilder({
    name: "dontyell",
    // checks if all the text is in caps
    searchCriteria: [/([A-Z]('| |!|\?)?){20,}/],
    description: "Asks the user to not yell",
})

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    let dontyell: string  = dontYellMessages[rngInt(0, dontYellMessages.length - 1)];

    ctx.message.reply({
        allowedMentions: { repliedUser: false },
        content: dontyell,
    });
};

export default {inline, middlewares: [execute]} as InlineCommand;