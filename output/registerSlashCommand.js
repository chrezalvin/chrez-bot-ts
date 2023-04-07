"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const commands_1 = __importDefault(require("./commands"));
if (config_1.DISCORD_TOKEN === undefined) {
    console.error("Error: Discord token is not defined!");
    process.exit(0);
}
const slashCommands = [];
for (const command of [...commands_1.default.active, ...commands_1.default.c_private]) {
    if (command.slash?.slashCommand) {
        slashCommands.push(command.slash.slashCommand.toJSON());
    }
}
if (config_1.MODE === "development")
    for (const command of commands_1.default.experimental.commands) {
        if (command.slash?.slashCommand)
            slashCommands.push(command.slash.slashCommand.toJSON());
    }
// Construct and prepare an instance of the REST module
const rest = new discord_js_1.REST({ version: '10' }).setToken(config_1.DISCORD_TOKEN);
// and deploy your commands!
(async () => {
    try {
        // The put method is used to fully refresh all commands in the guild with the current set
        for (const guildID of config_1.guildIDs) {
            console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);
            const data = await rest.put(discord_js_1.Routes.applicationGuildCommands(config_1.CLIENT_ID, guildID), { body: slashCommands });
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        console.log("All commands were registered sucessfuly!");
    }
    catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
