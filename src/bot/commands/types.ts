import { ChrezBotMiddlewareFunction, ChatContext, SlashContext } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

export interface SlashCommand{
    slash: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandOptionsOnlyBuilder;
    middlewares: ChrezBotMiddlewareFunction<SlashContext>[];
}

export interface ChatCommand{
    chat: ChatCommandBuilder,
    middlewares: ChrezBotMiddlewareFunction<ChatContext>[];
}

export interface InlineCommand {
    inline: InlineCommandBuilder;
    middlewares: ChrezBotMiddlewareFunction<ChatContext>[];
}