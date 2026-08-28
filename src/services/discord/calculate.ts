import { calculateExpressionString, ErrorValidation, MyEmbedBuilder } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const calculateSchema = z.object({
    expression: z.string()
});

export type I_Calculate = z.infer<typeof calculateSchema>;

export function calculate(args: I_Calculate): MessageCreateOptions & InteractionReplyOptions{
    const res = calculateExpressionString(args.expression);
    const expressionToSend = args.expression.replaceAll('*', '\\*');

    const embed = new MyEmbedBuilder();

    embed.setTitle("calculates the expression")
        .setDescription(`${expressionToSend} = ${res}`);

    return {
        embeds: [embed]
    };
}