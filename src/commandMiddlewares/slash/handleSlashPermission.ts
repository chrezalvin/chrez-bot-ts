import { ChrezBotSlashMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";
import { allCommands } from "@shared/commands";
import { BOT_OWNER_ID } from "@config";
import { UserService } from "@services";

export const handleSlashPermission: ChrezBotSlashMiddleware<CustomArgs> = async (client, interaction, next) => {
    if(!interaction.isChatInputCommand()) return;
    
    const command = allCommands.get(interaction.commandName);

    if(command){
        if(command.mode === "unavailable")
            return next(new ErrorValidation("slash_command_unavailable", command.name));

        switch(command.status){
            case "owner": {
                if(interaction.member?.user.id == BOT_OWNER_ID)
                    return next();
                else
                    return next(new ErrorValidation("command_is_owner_only"));
            }
            case "private": {
                if(interaction.member?.user.id && await UserService.userIsAdmin(interaction.member.user.id))
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
                return next(new ErrorValidation("slash_command_unavailable", command.name));
            }
        }
    }
}