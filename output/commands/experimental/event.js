"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const events_1 = require("../../services/events");
const run = async (args) => {
    const events = await (0, events_1.getEventByMonth)();
    const embeds = events.eventList.map(event => {
        return new _library_1.MyEmbedBuilder({
            title: event.name,
            description: event.description
        });
    });
    return embeds;
};
const chrezEvent = new _library_1.CommandBuilder()
    .setName("event")
    .setAlias(["e", "ev", "events"])
    .setDescription("Check what event is happening this month")
    .setMode("unavailable")
    .setExamples([
    {
        command: "Chrez event",
        description: "Give the list event this month"
    },
    {
        command: "Chrez event january",
        description: "Give the list of events in january"
    }
])
    .setSlash({
    interact: async (interaction, args) => {
        const embeds = await run(args);
        await interaction.reply({ embeds });
    }
})
    .setChat({
    execute: async (message, args) => {
        const embeds = await run(args);
        await message.channel.send({ embeds });
    }
});
exports.default = chrezEvent;
//# sourceMappingURL=event.js.map