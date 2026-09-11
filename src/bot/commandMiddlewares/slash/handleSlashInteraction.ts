import { ErrorValidation } from "@library";
import { ChrezBotMiddlewareFunction, ChatContext, SlashContext } from "@library/ChrezBot";
import { DiscordUserViewService } from "@services/supabase/services";
import z from "zod";
const debug = require("debug")("middleware:slash:requireDiscordUser");

const requireUserSchema = z.object({
    roles: z.enum(["owner", "vice", "admin", "user"]).array(),
}).optional()

type I_RequireUserSchema = z.input<typeof requireUserSchema>;

export function requireDiscordUser(options: I_RequireUserSchema){
    const parsed = requireUserSchema.parse(options);

    const handleUserRequired: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next) => {
        debug(`acquiring discord user...`);
        
        const user = await DiscordUserViewService.getDiscordUser(ctx.interaction.user.id);

        if(!user)
            throw new Error("Discord user not found!");

        debug(`discord user found: ${user.username}`);

        // no complain if role is undefined
        if(!parsed){
            ctx.user = user;
            return next();
        }

        debug(`got role from user ${user.role}`);
        
        const found = parsed.roles.find(permisssionRole => permisssionRole === user.role);

        if(found){
            ctx.user = user;
            next();
        }
        else{
            debug(`permission denied because user doesn't have role permission to use it`);
            next(new ErrorValidation("command_is_private"));
        }
    }

    return handleUserRequired;
}