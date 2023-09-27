import {CommandReturnTypes} from "@typings/customTypes";
import { MessageCreateOptions, MessagePayload, SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";
import {agrees} from "@assets/data/agrees.json";

function run(args: string[]): MessageCreateOptions | MessagePayload | string{
    if(args.length !== 0){
        const embed = new MyEmbedBuilder({title: args.join(" "), description: agrees[rngInt(0, agrees.length - 1)]});
        return {embeds: [embed]};
    }
    else 
        return agrees[rngInt(0, agrees.length - 1)];
}

const command: CommandReturnTypes = {
    name: "agree",
    description: "Agrees with you",
    alias: ["agrees", "agreed", "approve", "youagree?", "agree?"],
    execute: async (message, args: string[]) => {
        await message.channel.send(run(args));
    },
    slash:{
        slashCommand: new SlashCommandBuilder()
            .setName("agree")
            .setDescription("Agrees with you")
            .addStringOption(str => str.setDescription("your message for chrezbot to agree with").setRequired(false).setName("description")),
        interact: async (interaction) => {
            const description = interaction.options.getString("description", false);

            if(description === null)
                await interaction.reply({});


        }
    }
};

export default command;