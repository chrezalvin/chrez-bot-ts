import { MessageCreateOptions, MessagePayload, SlashCommandBuilder } from "discord.js";

import { rngInt, CommandBuilder, MyEmbedBuilder } from "@library";
import {agrees} from "@assets/data/agrees.json";

function run(args?: I_Agree): MessageCreateOptions | string{
    if(args?.description !== undefined && args?.description !== ""){
        const embed = new MyEmbedBuilder({title: args.description, description: agrees[rngInt(0, agrees.length - 1)]});
        return {embeds: [embed]};
    }
    else
        return agrees[rngInt(0, agrees.length - 1)];
}

interface I_Agree{
    description: string;
}

const slashCommand = new SlashCommandBuilder()
    .setName("agree")
    .setDescription("Agrees with you")
    .addStringOption(str => str.setDescription("your message for chrezbot to agree with")
    .setRequired(false)
    .setName("description"))

const agree = new CommandBuilder<I_Agree>()
        .setName("agree")
        .setAlias(["agrees", "agreed", "approve", "youagree?", "agree?"])
        .setStatus("hidden")
        .setDescription("Agrees with you")
        .setSlash({
            slashCommand,
            getParameter: (interaction) => {
                const description = interaction.options.getString("description", false);

                return {description: description ?? ""};
            },
            interact: async (interaction, args) => {
                const get = run(args);
                if(get instanceof MessagePayload)
                    await interaction.reply(get);
                else if(typeof get === "string")
                    await interaction.reply({content: get});
            }
        })
        .setChat({
            getParameter: (_, args) => {
                return {description: args.join(" ")};
            },
            execute: async (message, args) => {
                await message.channel.send(run(args));
            }
        })


export default agree;