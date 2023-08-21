import { MyEmbedBuilder } from "@modules/basicFunctions";
import {CommandReturnTypes} from "@typings/customTypes";
import { NewsChannel, SlashCommandBuilder, TextChannel, ThreadChannel } from "discord.js";

import { getProfileByID, userIsAdmin } from "@modules/profiles";

type GuildTextBasedChannel = TextChannel | NewsChannel | ThreadChannel;

const messageTimeout = 10;

const command: CommandReturnTypes = {
    name: "bulkdelete",
    description: "saying hello whenever user says hello",
    execute: async (message, args) => {
        if(!message.channel.isTextBased()) return;
        
        if(!message.guild || !message.guild.members.me) return;

        const embed = new MyEmbedBuilder();
        if(!message.guild.members.me.permissions.has("Administrator"))
            throw new Error("Chrezbot cannot delete message in this guild");
            
        if(args === undefined || args.length === 0)
            throw new Error("No amount to delete!");

        if(!userIsAdmin(message.author.id))
            throw new Error("This command is for private members only!");

        const num = parseInt(args[0]);
        if(isNaN(parseInt(args[0])))
            throw new Error("the argument given is not a number");
        if(num > 100)
            throw new Error("The maximum amount to delete is 100");
        if(num <= 0)
            throw new Error("argument can't be negative or 0");
        
        let amount = num;

        const res = await (message.channel as GuildTextBasedChannel).bulkDelete(amount, true);
        
        embed.setDescription(`successfully deleted ${res.size} messages`)
            .setTitle("delete messages")
            .setFooter({text: `This message will be deleted in ${messageTimeout} seconds`});

        const msg = await message.channel.send({embeds: [embed]});

        setTimeout(() => {
            if(msg.deletable)
                msg.delete();
        }, messageTimeout * 1000);
    },
    slash:{
        slashCommand: new SlashCommandBuilder()
            .setName("bulkdelete")
            .setDescription("Delete multiple messages at once")
            .addIntegerOption(opt => opt
                .setName("amount")
                .setDescription("Amount of messages to delete")
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
            ),
        interact: async (interaction) => {
            if(!interaction.guild || !interaction.guild.members.me) return;

            if(!interaction.guild.members.me.permissions.has("ManageMessages"))
                throw new Error("Chrezbot cannot delete message in this guild");

            if(!userIsAdmin(interaction.user.id))
                throw new Error("This command is for private members only!");
            
            await interaction.deferReply();
            const embed = new MyEmbedBuilder();

            const amount = interaction.options.getInteger("amount", true);

            const res = await (interaction.channel as GuildTextBasedChannel).bulkDelete(amount, true);
            if(res === undefined){
                throw new Error("Failed to delete message!");
            }

            if(res.size !== amount)
                embed.setDescription(`successfully deleted ${res.size} messages\nthe remaining ${amount - res.size} couldn't be deleted because of old message policy`);
            else
                embed.setDescription(`successfully deleted ${res.size} messages`);
                
            embed.setTitle("delete messages")
                .setFooter({text: `This message will be deleted in ${messageTimeout} seconds`});
            
            await interaction.reply({embeds: [embed]});

            setTimeout(() => {
                interaction.deleteReply();
            }, messageTimeout * 1000);
        }
    }
};

export default command;