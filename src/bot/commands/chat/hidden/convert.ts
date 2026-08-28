import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ErrorValidation } from "@library";
import { convert } from "@services/discord/convert";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "convert",
    alias: ["change", "switch", "transform"],
    description: "Convert a value to another unit",
    examples: [
        {
            command: "Chrez convert 15C to F",
            description: "Convert 15 Celsius to Fahrenheit"
        },
        {
            command: "Chrez convert 15lbs to kg",
            description: "Convert 15 pounds to kilograms"
        },
        {
            command: "Chrez convert 15km to miles",
            description: "Convert 15 kilometers to miles"
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    // example command is Chrez convert (15C) to (F)
    if(ctx.args.length !== 3)
        throw new ErrorValidation("message_error");

    const valueWithUnit = ctx.args[0];
    const toUnit = ctx.args[2];

    const value = Number(valueWithUnit.match(/\d+/)?.[0]);
    const fromUnit = valueWithUnit.match(/[a-zA-Z]+/)?.[0] ?? "";

    const res = await convert({
        value,
        fromUnit,
        toUnit
    });

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [execute]} as ChatCommand;