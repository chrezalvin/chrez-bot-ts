import { MessageCreateOptions, MessagePayload, SlashCommandBuilder } from "discord.js";

import { CommandBuilder, MyEmbedBuilder } from "@library";

function run(args?: I_Agree): MessageCreateOptions | string{
    if(args?.description !== undefined && args?.description !== ""){
        const embed = new MyEmbedBuilder({title: args.description, description: "agrees[rngInt(0, agrees.length - 1)]"});
        return {embeds: [embed]};
    }
    else 
        return "agrees[rngInt(0, agrees.length - 1)]";
}

interface I_Agree{
    description: string;
}

const slashCommand = new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Remind people")
    .addStringOption(str => str
        .setDescription("the time to remind the user, format: hh:mm")
        .setRequired(false)
        .setName("time")
    )
    .addStringOption(str => str
        .setDescription("the title of the message")
        .setRequired(false)
        .setName("title")
    )
    .addStringOption(str => str
        .setDescription("the description of the message")
        .setRequired(false)
        .setName("description")
    )
    .addMentionableOption(mention => mention
        .setDescription("the user to mention, if this is empty, it will mention you instead")
        .setRequired(false)
        .setName("mention")
    );

const remind = new CommandBuilder<I_Agree>()
        .setName("remind")
        .setAlias(["agrees", "agreed", "approve", "youagree?", "agree?"])
        .setDescription("Agrees with you")
        .setSlash({
            slashCommand,
            getParameter: (interaction) => {
                const description = interaction.options.getString("description", false);

                return {description: description ?? ""};
            },
            interact: async (interaction, args) => {
                const get = run(args);
                if(get instanceof MessagePayload)
                    await interaction.reply(get);
                else if(typeof get === "string")
                    await interaction.reply({content: get});
            }
        });


export default remind;


// import {CommandReturnTypes} from "library/customTypes";
// import { SlashCommandBuilder } from "discord.js";

// import {Event} from "@database";
// import { MyEmbedBuilder } from "@library/basicFunctions";

// const command: CommandReturnTypes = {
//     name: "remind",
//     alias: ["remindme", "timer"],
//     description: "Create a time reminder",
//     execute: async (message, args) => {
//         let eventName = args[0];
//         const embed = new MyEmbedBuilder();

//         if(eventName === undefined){
//             embed.setTitle("List of all events going on");
//             const data = await Event.findAll({
//                 limit: 10
//             });


//             if(data.length === 0)
//                 embed.setDescription("No event are currently active");
//             else
//                 embed.setDescription(data.map(data => `${data.dataValues.name} => ${data.dataValues.date}`).join("\n"));

//             await message.channel.send({embeds: [embed]});
//         }
//         else{
//             embed.setTitle(`list of all event called ${eventName}`);
//             // TODO CASE INSENSITIVE
//             const data = await Event.findAll({
//                 where: {
//                     name: eventName,
//                 }
//             });

//             if(data.length === 0)
//                 throw new Error(`event ${eventName} cannot be found!`);
            
//             embed.setDescription(data.map(data => `${data.dataValues.name} => ${data.dataValues.date}`).join("\n"));
//             await message.channel.send({embeds: [embed]});
//         }
//     },
//     slash:{
//         slashCommand: new SlashCommandBuilder()
//             .setName("event")
//             .setDescription("Give list of all event that will happen")
//             .addStringOption(opt => opt
//                 .setName("event_name")
//                 .setDescription("Specify the name of event")
//                 .setRequired(false)
//             ),
//         interact: async (interaction) => {
//             if(!interaction.isChatInputCommand())
//                 throw new Error("Bot can't reply the interaction received");

//             const event_name = interaction.options.getString("event_name", false);
//             const embed = new MyEmbedBuilder();

//             if(event_name === null){
//                 embed.setTitle("List of all events going on");
//                 const data = await Event.findAll({
//                     limit: 10
//                 });
    
//                 if(data.length === 0)
//                     embed.setDescription("No event are currently active");
//                 else
//                     embed.setDescription(data.map(data => `${data.dataValues.name} => ${data.dataValues.date}`).join("\n"));
    
//                 await interaction.reply({embeds: [embed]});
//             }
//             else{
//                 embed.setTitle(`list of all event called ${event_name}`);
//                 // TODO CASE INSENSITIVE
//                 const data = await Event.findAll({
//                     where: {
//                         name: event_name,
//                     }
//                 });

//                 if(data.length === 0)
//                     throw new Error(`event ${event_name} cannot be found!`);

//                 embed.setDescription(data.map(data => `${data.dataValues.name} => ${data.dataValues.date}`).join("\n"));
//                 await interaction.reply({embeds: [embed]});
//             }
//         }
//     }
// };

// export default command;