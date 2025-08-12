import { ChrezBotChatMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";
import { allCommands } from "@shared/commands";
import { BOT_OWNER_ID } from "@config";
import { UserService } from "@services";

export const handlePermission: ChrezBotChatMiddleware<CustomArgs> = async (client, message, next) => {
    const command = allCommands.find((_, name) => name === message.command)

    if(command){
        if(command.mode === "unavailable")
            return next(new ErrorValidation("chat_command_unavailable", command.name));

        switch(command.status){
            case "owner": {
                if(message.author.id == BOT_OWNER_ID)
                    return next();
                else
                    return next(new ErrorValidation("command_is_owner_only"));
            }
            case "private": {
                if(await UserService.userIsAdmin(message.author.id))
                    return next();
                else
                    return next(new ErrorValidation("command_is_private"));
            }
            case "hidden":
            case "public": {
                // no additional checks needed
                return next();
            }

            default: {
                return next(new ErrorValidation("chat_command_unavailable", command.name));
            }
        }
    }
}