import {MyEmbedBuilder, rngInt, CommandBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";

import whys from "@assets/messages/private/why.json";
import { UserService } from "@services";

const run = (args?: I_Why) => {
    if(!args)
        return "I don't know why you're asking me this.";

    const user = UserService.findUser((u) => u.discordId === args.discordId);
    const pickWhy = user?.data != null && user.data.role != "user" ? "normal": "exclusive";

    const why = whys[pickWhy][rngInt(0, whys[pickWhy].length - 1)];

    const embed = new MyEmbedBuilder({
        title: why.title,
        description: why.description,
        footer: {text: why.footer}
    })

    return {embeds: [embed]};
}

interface I_Why{
    discordId: string;
}

const slashCommand = new SlashCommandBuilder().setName("why").setDescription("Answering the real question");

const why = new CommandBuilder<I_Why>()
    .setName("why")
    .setDescription("Answering the real question")
    .setAlias(["y"])
    .setSlash({
        slashCommand,
        getParameter: (interaction) => {
            return {
                discordId: interaction.user.id
            };
        },
        interact: async (interaction, args) => {
            const res = run(args);
        
            await interaction.reply(res);
        }
    })
    .setChat({
        getParameter: (message, args) => {
            return {
                discordId: message.id
            };
        },
        execute: async (message, args) => {
            const res = run(args);
        
            await message.channel.send(res);
        }
    })

export default why;