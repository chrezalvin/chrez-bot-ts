"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const _services_1 = require("../../services");
const discord_js_1 = require("discord.js");
const monthAliases = [
    {
        "month": 1,
        "monthname": "January",
        "aliases": ["january", "jan"],
    },
    {
        "month": 2,
        "monthname": "February",
        "aliases": ["february", "feb"],
    },
    {
        "month": 3,
        "monthname": "March",
        "aliases": ["march", "mar"],
    },
    {
        "month": 4,
        "monthname": "April",
        "aliases": ["april", "apr"],
    },
    {
        "month": 5,
        "monthname": "May",
        "aliases": ["may"],
    },
    {
        "month": 6,
        "monthname": "June",
        "aliases": ["june", "jun"],
    },
    {
        "month": 7,
        "monthname": "July",
        "aliases": ["july", "jul"],
    },
    {
        "month": 8,
        "monthname": "August",
        "aliases": ["august", "aug"],
    },
    {
        "month": 9,
        "monthname": "September",
        "aliases": ["september", "sept"],
    },
    {
        "month": 10,
        "monthname": "October",
        "aliases": ["october", "oct"],
    },
    {
        "month": 11,
        "monthname": "November",
        "aliases": ["november", "nov"],
    },
    {
        "month": 12,
        "monthname": "December",
        "aliases": ["december", "dec"],
    },
];
function translateMonth(month) {
    const name = monthAliases.find(m => m.month === month)?.monthname;
    if (name === undefined)
        throw new Error("Month not found");
    return name;
}
const run = async (args) => {
    let monthOrTitle;
    if (args === undefined || args.str === "")
        monthOrTitle = new Date().getMonth() + 1;
    else if (args.str === "upcoming")
        monthOrTitle = new Date().getMonth() + 2;
    else {
        const month = monthAliases.find(m => m.aliases.includes(args.str.toLowerCase()));
        if (month)
            monthOrTitle = month.month;
        else
            monthOrTitle = isNaN(parseInt(args.str)) ? args.str : parseInt(args.str);
    }
    const res = await (typeof monthOrTitle === "number" ? _services_1.EventService.getEventByMonth(monthOrTitle) : _services_1.EventService.getEventByName(monthOrTitle));
    if (res === undefined || (Array.isArray(res) && res.length === 0)) {
        let error;
        if (typeof monthOrTitle === "number")
            error = `No event found in month ${translateMonth(monthOrTitle)}`;
        else
            error = `No event found with title ${monthOrTitle}`;
        return {
            embeds: [new _library_1.MyEmbedBuilder().setTitle(error)]
        };
    }
    const embeds = [];
    for (const event of Array.isArray(res) ? res : [res]) {
        embeds.push(new _library_1.MyEmbedBuilder()
            .setAuthor({ name: `${translateMonth(event.start_month)} ${event.start_day ? (0, _library_1.toOrdinal)(event.start_day) : ""} - ${translateMonth(event.end_month)} ${event.end_day ? (0, _library_1.toOrdinal)(event.end_day) : ""}` })
            .setTitle(event.title)
            .setURL(event.link)
            .setDescription(event.short_description)
            .setThumbnail(event.img_path));
    }
    return {
        embeds,
        content: `${embeds.length} event${embeds.length > 1 ? "s" : ""} found in ${typeof monthOrTitle === "number" ? translateMonth(monthOrTitle) : monthOrTitle}`
    };
};
const chrezEvent = new _library_1.CommandBuilder()
    .setName("event")
    .setAlias(["e", "ev", "events"])
    .setMode("available")
    .setDescription("Check what event is happening this month")
    .setExamples([
    {
        command: "Chrez event",
        description: "Give the list event this month"
    },
    {
        command: "Chrez event upcoming",
        description: "Give the list of upcoming event (next month)"
    },
    {
        command: "Chrez event january",
        description: "Give the list of events in january"
    },
    {
        command: "Chrez event 1",
        description: "Give the list of events in january"
    },
    {
        command: "Chrez event valentine",
        description: "Give valentine event description"
    }
])
    .setSlash({
    interact: async (interaction, args) => {
        const embeds = await run(args);
        await interaction.reply(embeds);
    },
    getParameter: (interaction) => {
        const month = interaction.options.getString("month", false);
        const title = interaction.options.getString("title", false);
        return {
            str: month || title || ""
        };
    },
    slashCommand: new discord_js_1.SlashCommandBuilder()
        .setName("event")
        .setDescription("give list of event with the given month")
        .addStringOption(option => {
        option.setName("month")
            .setDescription("month to search")
            .setRequired(false);
        for (const month of monthAliases) {
            option.addChoices({
                name: month.monthname,
                value: month.monthname
            });
        }
        return option;
    })
        .addStringOption(option => option
        .setName("title")
        .setDescription("title of the event")
        .setRequired(false)),
})
    .setChat({
    execute: async (message, args) => {
        const embeds = await run(args);
        await message.channel.send(embeds);
    },
    getParameter: (_, args) => {
        return {
            str: args[0] || ""
        };
    }
});
exports.default = chrezEvent;
//# sourceMappingURL=event.js.map