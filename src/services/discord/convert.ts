import { MyEmbedBuilder } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import conversionAlias from "@assets/messages/active/conversonAlias.json";
import z from "zod";
import { Unit } from "convert-units";
import convertUnits from "convert-units";

export const convertSchema = z.object({
    value: z.number(),
    fromUnit: z.string(),
    toUnit: z.string(),
});

export type I_Convert = z.infer<typeof convertSchema>;

function translateUnit(unit: string): Unit | undefined{
    const translated = conversionAlias.find(
        (conversion) => conversion.unit.toLowerCase() === unit.toLowerCase() || conversion.alias.map((x) => x.toLowerCase()).includes(unit.toLowerCase())
    )?.unit;

    return translated as Unit | undefined;
}

export async function convert(args: I_Convert): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const value = args.value;
    const from = args.fromUnit;
    const to = args.toUnit;

    const fromUnit = translateUnit(from);
    const toUnit = translateUnit(to);

    if(fromUnit === undefined || toUnit === undefined)
        throw new Error("Invalid conversion parameter");

    const result = convertUnits(value).from(fromUnit).to(toUnit);

    // round to 2 decimal places
    // found some bugs but eh whatever cm -> km
    const resultRound = Math.round(result * 100) / 100;

    const embed = new MyEmbedBuilder();
        embed.setTitle(`Conversion from ${fromUnit} to ${toUnit}`);
        embed.setDescription(`${value}${fromUnit} equals to ${resultRound}${toUnit}`);

    return {embeds: [embed]};
}