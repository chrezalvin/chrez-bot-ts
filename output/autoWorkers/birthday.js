"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = birthday;
// birthday responder
const debug = require("debug")("ChrezBot:birthday");
const cron_1 = require("cron");
const profiles_json_1 = __importDefault(require("../assets/data/profiles.json"));
const _library_1 = require("../library");
// name of month
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function birthday(client) {
    for (const profile of profiles_json_1.default) {
        if (profile.birthday) {
            debug(`adding bday schedule for ${profile.name}`);
            const date = new Date(profile.birthday.year ?? 2001, profile.birthday.month - 1, profile.birthday.day);
            const date2DaysBefore = new Date(profile.birthday.year ?? 2001, profile.birthday.month - 1, profile.birthday.day);
            date2DaysBefore.setDate(date2DaysBefore.getDate() - 2);
            new cron_1.CronJob(`0 8 ${date2DaysBefore.getDate()} ${date2DaysBefore.getMonth()} *`, async () => {
                // send to crystal phoenix
                const ch = await client.channels.fetch("739696962097512452");
                const embed = new _library_1.MyEmbedBuilder({
                    title: `Someone is having a birthday at ${monthNames[profile.birthday.month - 1]} ${profile.birthday.day}`,
                    description: "wonder who"
                });
                if (ch)
                    await ch.send({ embeds: [embed] });
            }, null, true, "Japan");
            new cron_1.CronJob(`0 8 ${date.getDate()} ${date.getMonth()} *`, async () => {
                // send to crystal phoenix
                const ch = await client.channels.fetch("739696962097512452");
                const embed = new _library_1.MyEmbedBuilder({
                    title: `${profile.name} is having a birthday!`,
                    description: `cool`
                });
                if (ch)
                    await ch.send({ embeds: [embed] });
            }, null, true, "Japan");
        }
    }
}
//# sourceMappingURL=birthday.js.map