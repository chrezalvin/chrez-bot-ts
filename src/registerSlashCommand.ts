import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, SlashCommandBuilder } from 'discord.js';
import { CLIENT_ID, guildIDs, DISCORD_TOKEN, MODE} from './config';
import commands from "./commands";

if(DISCORD_TOKEN === undefined){
    console.error("Error: Discord token is not defined!");
    process.exit(0);
}

const slashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
for(const command of [...commands.active, ...commands.c_private]){
    if(command.slash){
        console.log(`Registering command ${command.name}`);
        slashCommands.push(command.slash.slashCommand.toJSON());
    }
}

if(MODE === "development")
    console.log("On development mode, running experimental commands");
    for(const command of commands.experimental.commands){
        if(command.slash?.slashCommand){
            slashCommands.push(command.slash.slashCommand.toJSON());
        }
    }

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		// The put method is used to fully refresh all commands in the guild with the current set
        for(const guildID of guildIDs ){
            console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, guildID),
                { body: slashCommands },
            ) as any[];

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        console.log("All commands were registered sucessfuly!");
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();