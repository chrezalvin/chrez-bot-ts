import { MyEmbedBuilder } from "@library/basicFunctions";
import {CommandReturnTypes} from "library/customTypes";
import { SlashCommandBuilder } from "discord.js";

const command: CommandReturnTypes = {
    name: "embedify",
    description: "Creates an embed from arguments",
    unavailable: true,
    execute: (message) => {
        message.channel.send("embedify isnt available on chrez command at the moment, use slash command instead");
    },
    slash:{
        slashCommand: new SlashCommandBuilder()
            .setName("embedify")
            .setDescription("Creates an embed")
            .addStringOption(opt => opt.setName("description").setDescription("the description of the embed").setRequired(true))
            .addStringOption(opt => opt.setName("title").setDescription("title of the embed"))
            .addStringOption(opt => opt.setName("footer").setDescription("embed's footer"))
            .addAttachmentOption(opt => opt.setName("attachment").setDescription("image attachment of the embed"))
        ,
        interact: (interaction) => {
            const description = interaction.options.getString("description", true);
            const title = interaction.options.getString("title", false);
            const footer = interaction.options.getString("footer", false);
            const attachment = interaction.options.getAttachment("attachment", false);

            const embed = new MyEmbedBuilder({
                description,
                title: title ?? "\u200B",
            });
            if(footer)
                embed.setFooter({text: footer});

            if(attachment)
                embed.setThumbnail(attachment.url);

            interaction.reply({embeds: [embed]});
        }
    }
};

export default command;