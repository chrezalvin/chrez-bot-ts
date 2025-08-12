import { CacheType, ChannelType, Client, Interaction, Message, OmitPartialGroupDMChannel } from "discord.js";

export interface BasicParameters{
    command: string, 
    error?: unknown
}

export type ChrezBotNextFunction = (err?: unknown) => void;
export type ChrezBotChatMiddleware<_T extends BasicParameters> = (client: Client, message: OmitPartialGroupDMChannel<Message<boolean>> & _T, next: ChrezBotNextFunction) => Promise<void> | void;
export type ChrezBotSlashMiddleware<_T extends BasicParameters> = (client: Client, interaction: Interaction<CacheType> & _T, next: ChrezBotNextFunction) => Promise<void> | void;

export interface ChrezBotCommand<_T extends BasicParameters>{
    name: string;
    description: string;
    aliases?: string[];
    execute: ChrezBotChatMiddleware<_T>;
}

export interface ChrezBotSlashCommand<_T extends BasicParameters>{
    slash: string;
    description: string;
    execute: ChrezBotSlashMiddleware<_T>;
}

export class ChrezBot<_T extends BasicParameters>{
    protected m_client: Client;
    protected m_chat_middlewares: ChrezBotChatMiddleware<_T>[] = [];
    protected m_slash_middlewares: ChrezBotSlashMiddleware<_T>[] = [];

    constructor(
        discordClient: Client,
    ) {
        this.m_client = discordClient;
        this.registerCommands();
    }
    
    private async registerCommands(): Promise<void> {
        this.m_client.on("messageCreate", async (message) => {
            let iii: number = 0; // current index for middlewares
            const modifiedMessage = message as OmitPartialGroupDMChannel<Message<boolean>> & _T;
            
            const next: ChrezBotNextFunction = async (err) => {
                if (iii >= this.m_chat_middlewares.length)
                    return;

                if(err){
                    modifiedMessage.error = err;
                    iii = this.m_chat_middlewares.length - 1; // skip all middlewares
                }

                const middleware = this.m_chat_middlewares[iii++];
                await middleware(this.m_client, modifiedMessage, next);

                return this;
            }

            // Start the middleware chain
            next();
        });

        this.m_client.on("interactionCreate", async (interaction) => {
            let iii: number = 0; // current index for middlewares
            const modifiedInteraction = interaction as Interaction<CacheType> & _T;
            
            const next: ChrezBotNextFunction = async (err?) => {
                if (iii >= this.m_slash_middlewares.length)
                    return;
                if(err){
                    modifiedInteraction.error = err;
                    iii = this.m_slash_middlewares.length - 1; // skip all middlewares
                }

                const middleware = this.m_slash_middlewares[iii++];
                await middleware(this.m_client, modifiedInteraction, next);

                return this;
            }

            // Start the middleware chain
            next();
        });
    }

    public useChat(middleware: ChrezBotChatMiddleware<_T>): void {
        if (typeof middleware !== "function") {
            throw new Error("Middleware must be a function");
        }

        this.m_chat_middlewares.push(middleware);
    }

    public useSlash(middleware: ChrezBotSlashMiddleware<_T>): void {
        if (typeof middleware !== "function") {
            throw new Error("Middleware must be a function");
        }

        this.m_slash_middlewares.push(middleware);
    }

    public chat(allowedChannelTypes: ChannelType[], command: ChrezBotCommand<_T>){
        const middleware: ChrezBotChatMiddleware<_T> = async (client, message, next) => {
            if(message.error)
                // skips when error
                next();

            if(
                allowedChannelTypes.includes(message.channel.type)
                &&
                (
                    message.command === command.name
                    ||
                    (command.aliases?.includes(message.command) ?? false)
                )
            )
                command.execute(client, message, next);
            else
                next();
        }

        this.m_chat_middlewares.push(middleware);
    }

    public slash(command: ChrezBotSlashCommand<_T>){
        const middleware: ChrezBotSlashMiddleware<_T> = async (client, interaction, next) => {
            if(interaction.error)
                // immediately go to error handling when error
                next();

            if(interaction.isCommand() && interaction.commandName === command.slash)
                await command.execute(client, interaction, next);
            else
                next();
        }

        this.m_slash_middlewares.push(middleware);
    }
}