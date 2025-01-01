const debug = require("debug")("Bot:registerSlashCommand");

import { allCommands } from "@shared";
import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import { CLIENT_ID, guildIDs, DISCORD_TOKEN } from './config';

if(DISCORD_TOKEN === undefined){
    console.error("Error: Discord token is not defined!");
    process.exit(0);
}

const slashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
for(const [_, command] of allCommands){
    if(command.slash && command.status !== "hidden")
        slashCommands.push(command.slash.slashCommand.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		// The put method is used to fully refresh all commands in the guild with the current set
        for(const guildID of guildIDs ){
            debug(`Started refreshing ${slashCommands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, guildID),
                { body: slashCommands },
            ) as any[];

            debug(`Successfully reloaded ${data.length} application (/) commands in guild ${guildID}.`);
            debug(`List of all commands: ${slashCommands.map(cmd => cmd.name).join(" | ")}`);
        }
        console.log("All commands were registered sucessfuly!");
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();