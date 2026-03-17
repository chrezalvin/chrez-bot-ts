import { MyEmbedBuilder, CommandBuilder } from "@library";
import { TraitService } from "@services";
import { SlashCommandBuilder } from "discord.js";

const run = async (args?: I_Trait) => {
    if(args === undefined || args.name === "")
        return {embeds: [MyEmbedBuilder.createError({description: "Please provide a name"})]};

    if(args.name.length < 3)
        return {embeds: [MyEmbedBuilder.createError({description: "Name must be at least 3 characters long"})]};

    const traits = await TraitService.getTraitByName(args.name);

    if(traits.length === 0)
        return {embeds: [MyEmbedBuilder.createError({description: "No trait found"})]};

    const embeds: MyEmbedBuilder[] = [];

    for(const trait of traits){
        const embed = new MyEmbedBuilder();

        embed.setTitle(trait.name);

        embed.setFields([
            {
                name: "Description",
                value: trait.description
            }
        ])

        if (trait.img_path)
            embed.setThumbnail(trait.img_path);

        if (trait.extra)
            embed.setFooter({text: trait.extra});

        embeds.push(embed);
    }

    return {embeds, content: `found ${traits.length} trait named "${args.name}"`};
}

interface I_Trait{
    name: string;
}

const chrezTrait = new CommandBuilder<I_Trait>()
    .setName("trait")
    .setAlias(["traits"])
    .setMode("available")
    .setDescription("Search trait by name")
    .setExamples([
        {
            command: "Chrez trait <name>",
            description: "Searches for trait with the given name"
        }
    ])
    .setSlash({
        interact: async (interaction, args) => {
            const embeds = await run(args);
            
            await interaction.reply(embeds);
        },
        getParameter: (interaction) => {
            return {
                name: interaction.options.getString("name") || ""
            };
        },
        slashCommand: new SlashCommandBuilder()
            .setName("trait")
            .setDescription("Search trait by name")
            .addStringOption(option => 
                option.setName("name")
                    .setDescription("The name of the trait")
                    .setRequired(true)
            )
    })
    .setChat({
        execute: async (message, args) => {
            const embeds = await run(args);
        
            await message.channel.send(embeds);
        },
        getParameter: (_, args) => {
            return {
                name: args.join(" ")
            };
        }
    })

export default chrezTrait;