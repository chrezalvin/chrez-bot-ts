import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import whys from "@assets/messages/private/why.json";
import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";
import { CommandBuilder } from "@modules/CommandBuilder";

const run = (args?: I_Why) => {
    const why = whys[rngInt(0, whys.length - 1)];

    const embed = new MyEmbedBuilder({
        title: why.title,
        description: why.description,
        footer: {text: why.footer}
    })

    return {embeds: [embed]};
}

interface I_Why{

}

const slashCommand = new SlashCommandBuilder().setName("why").setDescription("Answering the real question");

const why = new CommandBuilder<I_Why>()
    .setName("why")
    .setDescription("Answering the real question")
    .setAlias(["y"])
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

export default why;