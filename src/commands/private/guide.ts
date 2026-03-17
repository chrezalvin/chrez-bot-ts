import {MyEmbedBuilder, CommandBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";

import {guideDataLookup} from "@assets/guideData";

interface I_Guide{
    guide_type: string;
    channelId: string;
}

const slashCommand = new SlashCommandBuilder()
    .setName("guide")
    .setDescription("Prints a guide for the game")
    .addStringOption(option => option
        .setName("guide_type")
        .setDescription("The type of guide to print")
        .setChoices(
            guideDataLookup.map(ele => ({name: ele.name, value: ele.name}))
        )
        .setRequired(true)
    )
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("The channel to send the guide to")
        .setRequired(true)
    );

const guide = new CommandBuilder<I_Guide>()
    .setName("guide")
    .setDescription("Prints a guide for the game")
    .setStatus("private")
    .setSlash({
        slashCommand,
        getParameter: (interaction) => {
            return {
                guide_type: interaction.options.getString("guide_type") || "",
                channelId: interaction.options.getChannel("channel")?.id || ""
            };
        },
        interact: async (interaction, args) => {
            if(!args)
                throw new Error("Invalid arguments");

            const guild = interaction.guild;

            if(!guild)
                throw new Error("This command can only be used in a server");
            
            const channel = guild.channels.cache.get(args.channelId);

            if(!channel)
                throw new Error("Invalid channel");

            if(!channel.isTextBased() || !channel.isSendable())
                throw new Error("Channel is not text based");

            const guideData = guideDataLookup.find(ele => ele.name === args.guide_type);

            if(!guideData)
                throw new Error("Guide data not found");
        
            await interaction.reply({
                embeds: [
                    new MyEmbedBuilder()
                        .setTitle(`Constructing ${args.guide_type} Guide!`)
                        .setDescription(`${args.guide_type} Guide is being constructed at https://discord.com/channels/${guild.id}/${channel.id}`)
                ]
            });


            const dataList: {url: string, title: string}[] = [];
        
            for(const ele of guideData.data){
                const myEmbed = new MyEmbedBuilder(ele);
                const message = await channel.send({
                    embeds: [myEmbed],
                })
        
                dataList.push({url: message.url, title: ele.title!});
            }
        
            const pageSize = 35;
        
            for(let iii = 0; iii < dataList.length; iii += pageSize){
                const subTraits = dataList.slice(iii, iii + pageSize);
        
                const embedBuilderIndex = new MyEmbedBuilder();
            
                embedBuilderIndex.setColor("Green");
                embedBuilderIndex.setThumbnail("https://toram-jp.akamaized.net/en/sidestory_pelulu/img/illustration-1.jpg")
                embedBuilderIndex.setTitle(`${guideData.name} Guide Index List`);
                embedBuilderIndex.setDescription(`Please select the blue text below to guide you to the selected Guide\n ${subTraits.map((trait, index) => `**${index + 1 + iii}.** [${trait.title}](${trait.url})`).join("\n")}`);
            
                embedBuilderIndex.setFooter({text: "you can use pinned message to quickly go back here"})
            
                await channel.send({embeds: [embedBuilderIndex]});
            }
        
            await channel.send({
                embeds: [
                    new MyEmbedBuilder({
                        title: "Credits",
                        description: `The info for ${guideData.name} explanation was gathered from Phantom's Library and personal findings`,
                        thumbnail: {
                            url: "https://media.discordapp.net/attachments/842252962961424414/858319407724625940/unknown.png?ex=69b9ee7d&is=69b89cfd&hm=31ff25a1e01018119ef6d1a65272a23b63cc5a34c3549baaea806d2e7c31d136&=&format=webp&quality=lossless&width=783&height=785"
                        },
                    }).setColor("Green")
                ]
            });
        }
    });

export default guide;