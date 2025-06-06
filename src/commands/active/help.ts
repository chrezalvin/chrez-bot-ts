import { CacheType, ChatInputCommandInteraction, Message, SlashCommandBuilder, User } from "discord.js";
import { CommandBuilder, MyEmbedBuilder, isChatInputCommandInteraction } from "@library";

import { MODE, BOT_PREFIXES } from "@config";
import { UserService } from "@services";

function help(
    index: CommandBuilder<any>[], 
    privateCommands: CommandBuilder<any>[]
){
    const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType> , args?: I_Help) => {
        let command: string | null = args?.command ?? null;
        const embed = new MyEmbedBuilder();
    
        if(command === null){
            // displays all active commands
            embed.setTitle("Chrez-Bot active command help menu")
                .setDescription("here are the list of commands that chrezbot can use")

            for(const command of index){
                // only safe to show public commands
                if(
                    command.status === "private" || 
                    command.status === "hidden" || 
                    command.mode === "unavailable" || 
                    (MODE === "production" && command.mode === "experimental")
                ) continue;

                embed.addFields({
                    name: `\`${BOT_PREFIXES[0]} ${command.name}\``, 
                    value: command.description,
                    inline: true
                });
            }
        }
        else if(command === "private"){
            let user: User;

            if(isChatInputCommandInteraction(message))
                user = message.user;
            else
                user = message.author;

            if(!UserService.userIsAdmin(user.id))
                throw new Error("You're not a private member");

            embed.setTitle("Hold it!")
                .setDescription("Due to security concerns, Chrez-Bot won't send command menu here!\nI've send private command help menu to your DM, check it out!");

            user.send({embeds: [
                new MyEmbedBuilder()
                    .setTitle("Chrez-Bot private command help menu")
                    .setDescription("here are the list of private commands that chrezbot can use")
                    .setFields(privateCommands.map(idx => {return {name: `\`${BOT_PREFIXES[0]} ${idx.name}\``, value: idx.description, inline: true}}))
            ]});
        }
        else{
            // if user search for a specific command, then hidden command can be accessed

            const find = index.find(idx => {
                if(idx.name === command) return true;
                if(idx.alias)
                    return idx.alias.find(al => al === command) !== undefined;
                return false;
            });
        
            if(find === undefined)
                throw new Error("Cannot find the active command or its aliases!");
            
            embed.setTitle(`${BOT_PREFIXES[0]} ${find.name} ${find.slash ? `or \`/${find.slash?.slashCommand.name}\``: ""}`)
                .setDescription(find.description);
            if(find.examples && find.examples.length > 0){
                embed.addFields({name: "Examples", value: "\u200B"});
                embed.addFields(find.examples.map(example => { return {name: example.command, value: example.description ?? "\u200B", inline: true}}));
            }

            if(find.alias && find.alias.length > 0)
                embed.setFooter({text: `possible alias for this command: ${find.alias.map(al => `\`${BOT_PREFIXES[0]} ${al}\``).join(", ")}`})
        }
        
        return [embed];
    } 

    interface I_Help{
        command: string | null;
    }

    const slashCommand = new SlashCommandBuilder()
            .setName("help")
            .setDescription("give all commands for chrezbot or specify which command to check").
            addStringOption(opt => {
                opt.setName("command").setDescription("command to check");
                for(const idx of index){
                    if(
                        idx.status === "private" || 
                        idx.status === "hidden" || 
                        idx.mode === "unavailable" || 
                        (MODE === "production" && idx.mode === "experimental")
                    ) continue;

                    opt.addChoices({name: `${BOT_PREFIXES[0]} ${idx.name}`, value: idx.name})
                }

                return opt;
            });

    const chrezHelp = new CommandBuilder<I_Help>()
        .setName("help")
        .setAlias(["h", "manual"])
        .setDescription("give all commands for chrezbot")
        .setSlash({
            slashCommand,
            interact: async (interaction, args) => {
                const embeds = await run(interaction, args);
                
                await interaction.reply({embeds});
            },
            getParameter: (interaction) => {
                const command = interaction.options.getString("command", false);

                return {command};
            }
        })
        .setChat({
            execute: async (message, args) => {
                const embeds = await run(message, args);

                await message.channel.send({embeds});
            },
            getParameter: (_, args) => {
                let command: string | null = null;

                if(args && args[0] !== undefined)
                    command = args[0];

                return {command};
            }
        })


    return chrezHelp;
};

export default help;