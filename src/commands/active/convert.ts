import { SlashCommandBuilder } from "discord.js";
import convert from "convert-units";
import { type Unit } from "convert-units";
import conversionAlias from "@assets/messages/active/conversonAlias.json";
import { CommandBuilder, ExampleField, MyEmbedBuilder, ErrorValidation } from "@library";

function translateUnit(unit: string): Unit | undefined{
    const translated = conversionAlias.find(
        (conversion) => conversion.unit.toLowerCase() === unit.toLowerCase() || conversion.alias.map((x) => x.toLowerCase()).includes(unit.toLowerCase())
    )?.unit;

    return translated as Unit | undefined;
}

function run(args?: I_Convert){
    if(args === undefined)
        return "Invalid conversion parameter";

    const value = args.value;
    const from = args.fromUnit;
    const to = args.toUnit;

    const fromUnit = translateUnit(from);
    const toUnit = translateUnit(to);

    if(fromUnit === undefined || toUnit === undefined)
        return "Invalid conversion parameter";

    const result = convert(value).from(fromUnit).to(toUnit);

    // round to 2 decimal places
    // found some bugs but eh whatever cm -> km
    const resultRound = Math.round(result * 100) / 100;

    const embed = new MyEmbedBuilder();
        embed.setTitle(`Conversion from ${fromUnit} to ${toUnit}`);
        embed.setDescription(`${value}${fromUnit} equals to ${resultRound}${toUnit}`);

    return {embeds: [embed]};
}

interface I_Convert{
    value: number;
    fromUnit: string;
    toUnit: string;
}

const slashCommand = new SlashCommandBuilder()
    .setName("convert")
    .setDescription("convert a value to another unit")
    .addStringOption(str => str.setDescription("the value you want to convert, ex: 15C").setRequired(true).setName("value"))
    .addStringOption(str => str.setDescription("the unit you want to convert to, ex: F").setRequired(true).setName("to"));

const exampleField: ExampleField[] = [
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
];

const agree = new CommandBuilder<I_Convert>()
        .setName("convert")
        .setAlias(["change", "switch", "transform"])
        .setDescription("Convert a value to another unit")
        .setExamples(exampleField)
        .setSlash({
            slashCommand,
            getParameter: (interaction) => {
                const valueWithUnit = interaction.options.getString("value", true);
                const toUnit = interaction.options.getString("to", true);

                const value = Number(valueWithUnit.match(/\d+/)?.[0]);
                const fromUnit = valueWithUnit.match(/[a-zA-Z]+/)?.[0];

                if(value === undefined || fromUnit === undefined)
                    return new ErrorValidation("message_error");

                return {
                    value,
                    fromUnit,
                    toUnit
                };
            },
            interact: async (interaction, args) => {

                const get = run(args);

                await interaction.reply(get);
            }
        })
        .setChat({
            getParameter: (message, args) => {
                // example command is Chrez convert (15C) to (F)
                if(args.length !== 3)
                    return new ErrorValidation("message_error");

                const valueWithUnit = args[0];
                const toUnit = args[2];

                const value = Number(valueWithUnit.match(/\d+/)?.[0]);
                const fromUnit = valueWithUnit.match(/[a-zA-Z]+/)?.[0];

                if(value === undefined || fromUnit === undefined)
                    return new ErrorValidation("message_error");

                return {
                    value,
                    fromUnit,
                    toUnit
                };
            },
            execute: async (message, args) => {
                await message.channel.send(run(args));
            }
        })


export default agree;