import { ChrezBotChatMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";
import { allCommands } from "@shared/commands";

export const isCommand: ChrezBotChatMiddleware<CustomArgs> = (client, message, next) => {
    const args = message.content.split(" ").slice(1);
    const commandName = args.shift() ?? "";

    for(const [name, command] of allCommands) {
        // Check if the command name matches the command's name
        if (command.name === commandName || command.alias.includes(commandName)) {
            // If it matches, set the command and args in the client
            message.command = name;
            message.args = args;
            return next();
        }
    }

    next(new ErrorValidation("chat_command_unavailable", commandName));
}