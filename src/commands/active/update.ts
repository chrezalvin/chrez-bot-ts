const debug = require("debug")("ChrezBot:update");

import {MyEmbedBuilder, CommandBuilder, ErrorValidation} from "@library";

import { APIEmbedField, SlashCommandBuilder } from "discord.js";
import updates from "@assets/messages/active/update.json";
import { BOT_PREFIXES, BOT_VERSION } from "@config";
import { UpdateService } from "services/update";

function customFieldMaker(title: string, list: string[]): APIEmbedField{
    return {
        name: title,
        value: list.join("\n")
    };
}

const run = async (version: string) => {
    debug(`getting update for version ${version}`);
    // defaulted to latest version
    // let version: string = args?.version ?? botVersion;

    const update = await UpdateService.getUpdate(version);
    const embed = new MyEmbedBuilder();

    embed.setTitle(`Chrezbot \`v${update.version}\` news and bugfixes`)
    if(update.news)
        embed.addFields(customFieldMaker("news", update.news));
    if(update.bugfix)
        embed.addFields(customFieldMaker("bugfix", update.bugfix));

    return [embed];
} 

interface I_Update{
    version: string;
}

const update = new CommandBuilder<I_Update>()
    .setName("update")
    .setAlias(["u", "news"])
    .setDescription("Gives you update about chrezbot (news and bugfixes)")
    .setExamples([
        {command: `${BOT_PREFIXES[0]} update`, description: "give latest update"},
        {command: `${BOT_PREFIXES[0]} update 1.1.0`, description: "give update 1.1.0"}
    ])
    .setSlash({
        slashCommand: new SlashCommandBuilder().setName("update")
            .setDescription("Gives you update about ChrezBot (news and bugfixes)")
            .addStringOption(opt => {
                for(const update of updates)
                    opt.addChoices({name: `v${update.version}`, value: update.version})

                opt.setName("version");
                opt.setDescription("Version to specify");

                return opt;
            }),
        getParameter: (interaction) => {
            const version = interaction.options.getString("version", false) ?? BOT_VERSION;

            return {version};
        },
        interact: async (interaction, args) => {
            if(!args)
                return new ErrorValidation("no_argument_provided");

            const embeds = await run(args.version);

            await interaction.reply({embeds});
        }
    })
    .setChat({
        getParameter: (_, args) => {
            let version: string = BOT_VERSION;

            if(args && args[0] !== undefined)
                version = args[0];

            return {version};
        },
        execute: async (message, args) => {
            if(!args)
                return new ErrorValidation("no_argument_provided");
            
            const embeds = await run(args.version);

            message.channel.send({embeds});
        },
    })

export default update;