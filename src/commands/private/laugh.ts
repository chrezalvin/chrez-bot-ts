import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import laughs from "@assets/messages/private/laugh.json";
import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";
import { CommandBuilder } from "@modules/CommandBuilder";

const run = (args?: I_Laugh) => {
    const laugh = laughs[rngInt(0, laughs.length - 1)];

    const embed = new MyEmbedBuilder({
        title: "Chrezbot is laughing",
        description: laugh
    })

    return {embeds: [embed]};
}

interface I_Laugh{

}

const slashCommand = new SlashCommandBuilder().setName("laugh").setDescription("laughs at you");

const laugh = new CommandBuilder<I_Laugh>()
    .setName("laugh")
    .setDescription("laughs at you")
    .setAlias(["haha", "l", "laughs", "heh"])
    .setSlash({
        slashCommand,
        getParameter: (interaction) => {
            return {};
        },
        interact: async (interaction, args) => {
            const res = run(args);
        
            await interaction.reply(res);
        }
    })
    .setChat({
        getParameter: (message, args) => {
            return {};
        },
        execute: async (message, args) => {
            const res = run(args);
        
            await message.channel.send(res);
        }
    })

export default laugh;