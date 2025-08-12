import { ChrezBotChatMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";
import { MAX_MESSAGE_ALLOWED } from "@config";

export const handleLongText: ChrezBotChatMiddleware<CustomArgs> = (client, message, next) => {
    // simply ignore messages that are too long
    if (message.content.length < MAX_MESSAGE_ALLOWED)
        next();
}