import { MyEmbedBuilder, CommandBuilder } from "@library";
import { RegistletService } from "@services";
import { SlashCommandBuilder } from "discord.js";

const run = async (args?: I_Registlet) => {
    if(args === undefined || args.name === "")
        return {embeds: [MyEmbedBuilder.createError({description: "Please provide a name"})]};

    if(args.name.length < 3)
        return {embeds: [MyEmbedBuilder.createError({description: "Name must be at least 3 characters long"})]};

    const registlets = await RegistletService.getRegistletByName(args.name);

    if(registlets.length === 0)
        return {embeds: [MyEmbedBuilder.createError({description: "No registlet found"})]};

    const embeds: MyEmbedBuilder[] = [];

    for(const registlet of registlets){
        const embed = new MyEmbedBuilder();

        embed.setTitle(registlet.name);

        embed.setFields([
            {
                name: "Max Level",
                value: registlet.max_level.toString()
            },
            {
                name: "Description",
                value: registlet.description
            }
        ])

        embed.setThumbnail(registlet.img_path);
        embed.setFooter({text: `available at stoodie level ${registlet.stoodie_levels.join(", ")}`});

        embeds.push(embed);
    }

    return {embeds, content: `found ${registlets.length} registlet named "${args.name}"`};
}

interface I_Registlet{
    name: string;
}

const chrezRegistlet = new CommandBuilder<I_Registlet>()
    .setName("registlet")
    .setAlias(["regi", "reg", "regis"])
    .setMode("available")
    .setDescription("Search registlet by name")
    .setExamples([
        {
            command: "Chrez registlet <name>",
            description: "Searches for registlet with the given name"
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
            .setName("registlet")
            .setDescription("Search registlet by name")
            .addStringOption(option => 
                option.setName("name")
                    .setDescription("The name of the registlet")
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
                name: args[0] || ""
            };
        }
    })

export default chrezRegistlet;