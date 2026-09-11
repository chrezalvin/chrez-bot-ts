const debug = require("debug")("ChrezBot:bot");

import { CacheType, ChatInputCommandInteraction, Client, Interaction, Message, OmitPartialGroupDMChannel } from "discord.js";
import { middlewareEngine, MiddlewareFunction } from "./middlewareEngine";

declare global {
    namespace ChrezBot {
        // Users will augment this interface globally
        interface ChatContext {}
        interface SlashContext {}
    }
}

export interface ChatContext extends ChrezBot.ChatContext{
    message: OmitPartialGroupDMChannel<Message<boolean>>;
}

export interface SlashContext extends ChrezBot.SlashContext{
    interaction: Interaction<CacheType>;
}

export type ChrezBotNextFunction = (err?: any) => void;
export type ChrezBotMiddlewareFunction<_T> = (ctx: _T, next: ChrezBotNextFunction, error?: any) => Promise<void>;

export class ChrezBot{
    protected m_client: Client;
    protected m_chat_middlewares: MiddlewareFunction<ChatContext>[] = [];    
    protected m_slash_middlewares: MiddlewareFunction<SlashContext>[] = [];

    constructor(
        discordClient: Client,
    ) {
        this.m_client = discordClient;
        this.registerCommands();
    }

    private async defaultErrorHandler(err: any){
        console.log(`unhandled error: ${err}`);
    }
    
    private async registerCommands(): Promise<void> {
        this.m_client.on("messageCreate", async (message) => {
            debug(message.content);

            const context = {
                message,
            } as ChatContext;
            const handle = middlewareEngine(...this.m_chat_middlewares, this.defaultErrorHandler);
            
            await handle(context)
        });

        this.m_client.on("interactionCreate", async (interaction) => {
            const context = {
                interaction
            } as SlashContext;

            const handle = middlewareEngine(...this.m_slash_middlewares, this.defaultErrorHandler);

            await handle(context)
        });

        this.m_client.once("clientReady", () => {
            console.log("Bot ready!");
            debug([
                `middleware chains:`,
                `slash: ${this.m_slash_middlewares.map(m => m.name).join(" -> ")}`,
                `chat: ${this.m_chat_middlewares.map(m => m.name).join(" -> ")}`,
            ].join("\n"));
        });
    }

    public useChat(...middlewares: ChrezBotMiddlewareFunction<ChatContext>[]): void {
        this.m_chat_middlewares.push(...middlewares);
    }


    public useSlash(...middlewares: ChrezBotMiddlewareFunction<SlashContext>[]): void {
        this.m_slash_middlewares.push(...middlewares);
    }

    get client(){ return this.m_client; }
}