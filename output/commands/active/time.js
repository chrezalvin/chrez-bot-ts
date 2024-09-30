"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("ChrezBot:time");
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const timeChoices_json_1 = __importDefault(require("../../assets/messages/active/timeChoices.json"));
const profiles_json_1 = __importDefault(require("../../assets/data/profiles.json"));
const run = (args) => {
    let timezone = args?.timezone ?? null;
    const time = new Date();
    const embed = new _library_1.MyEmbedBuilder();
    if (timezone == null) {
        const japTime = time.toLocaleString('en-US', { timeZone: "Japan", hour12: false }).split(' ')[1];
        // calculate time left
        const timeLeft = {
            hour: 24 - (time.getUTCHours() + 10) % 24,
            minute: 60 - time.getUTCMinutes()
        };
        let myText;
        if (timeLeft.minute == 0)
            myText = `${time.getHours()} hours left`;
        else if (timeLeft.hour == 0)
            myText = `${timeLeft.minute} minutes left`;
        else if (timeLeft.hour == 0 && timeLeft.minute == 0)
            myText = `It's midnight`;
        else
            myText = `${timeLeft.hour} hours and ${timeLeft.minute} minutes left`;
        embed.setTitle(`it's ${japTime} Japanese time`).setFooter({ text: `${myText} until midnight` });
        return [embed];
    }
    else {
        for (const timeChoice of timeChoices_json_1.default) {
            if (timeChoice.timezone === timezone || timeChoice.criteria.find(crit => crit.toLowerCase() === timezone?.toLowerCase()) !== undefined) {
                const localTime = time.toLocaleString('en-US', { timeZone: timeChoice.timezone, hour12: false, dateStyle: "full", timeStyle: "medium" }).split(' ');
                embed.setTitle(`${timeChoice.name} time`).setDescription(`**${localTime.join(" ")}**`);
                return [embed];
            }
        }
        for (const profile of profiles_json_1.default) {
            if (profile.timezone)
                if (profile.name.toLowerCase() === timezone.toLowerCase() || profile.alias.find(ali => ali.toLowerCase() === timezone?.toLowerCase()) !== undefined) {
                    const localTime = time.toLocaleString('en-US', { timeZone: profile.timezone, hour12: false, dateStyle: "full", timeStyle: "medium" }).split(' ');
                    embed.setTitle(`${profile.timezone} time`).setDescription(`**${localTime.join(" ")}**`);
                    return [embed];
                }
        }
        throw new Error("timezone not found!");
    }
};
const chreztime = new _library_1.CommandBuilder()
    .setName("time")
    .setAlias(["t", "chrono"])
    .setDescription("Check japanese time (and how long is it until midnight)")
    .setStatus("public")
    .setMode("available")
    .setSlash({
    slashCommand: new discord_js_1.SlashCommandBuilder().setName("time")
        .setDescription("Check japanese time (and how long is it until midnight)")
        .addStringOption(opt => {
        opt.setName("timezone").setDescription("Timezone to check");
        for (const timeChoice of timeChoices_json_1.default) {
            if (timeChoice.memberRef)
                opt.addChoices({ name: `(${timeChoice.memberRef}) ${timeChoice.name}`, value: timeChoice.timezone });
            else
                opt.addChoices({ name: timeChoice.name, value: timeChoice.timezone });
        }
        return opt;
    }),
    getParameter: (interaction) => {
        const timezone = interaction.options.getString("timezone", false);
        return { timezone };
    },
    interact: async (interaction, args) => {
        const embeds = run(args);
        interaction.reply({ embeds });
    }
})
    .setChat({
    getParameter: (_, args) => {
        let timezone = null;
        if (args && args[0] !== undefined)
            timezone = args[0];
        return { timezone };
    },
    execute: async (message, args) => {
        const embeds = run(args);
        message.channel.send({ embeds });
    },
});
exports.default = chreztime;
//# sourceMappingURL=time.js.map