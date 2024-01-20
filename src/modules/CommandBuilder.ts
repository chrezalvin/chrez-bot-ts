import { CacheType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { Cause, isChatInputCommandInteraction } from "@typings/customTypes";
const debug = require("debug")("ChrezBot:command");

export interface ExampleField{
    command: string;
    description?: string;
}

enum CommandStatuses{
    public,
    private,
}

enum Modes{
    available,
    unavailable,
    experimental,
}

export type CommandStatus = keyof typeof CommandStatuses;
export type Mode = keyof typeof Modes;

interface I_SlashCommand<_T> {
    slashCommand: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    interact: (interaction: ChatInputCommandInteraction<CacheType>, args?: _T) => Promise<Cause | void>;
    getParameter?: (interaction: ChatInputCommandInteraction<CacheType>) => _T;
}

interface I_ChatCommand<_T> {
    execute: (message: Message<boolean>, args?: _T) => Promise<Cause | void>;
    getParameter?: (message: Message<boolean>, args: string[]) => _T;
}

interface CommandData<_T>{
    name: string;
    alias: string[]; 
    description: string;
    status: CommandStatus;
    mode: Mode;
    examples: ExampleField[];
    slash?: I_SlashCommand<_T>;
    chat?: I_ChatCommand<_T>;
}

export class CommandBuilder<_T> implements CommandData<_T>{
    /**
     * Typeguard for CommandBuilder
     */
    public static isCommandBuilder<_T>(object: unknown): object is CommandBuilder<_T>{
        return object instanceof CommandBuilder;
    }

    private m_mode: CommandData<_T>["mode"] = "experimental";
    private m_name: CommandData<_T>["name"] = "";
    private m_alias: CommandData<_T>["alias"] = [];
    private m_description: CommandData<_T>["description"] = "";
    private m_slash: CommandData<_T>["slash"] = undefined;
    private m_chat: CommandData<_T>["chat"] = undefined;
    private m_commandStatus: CommandData<_T>["status"] = "public";

    public examples: ExampleField[] = [];

    constructor(
        data?: Partial<CommandData<_T>>
    ){
        if(data){
            this.setName(data.name ?? "");
            this.setAlias(data.alias ?? []);
            this.setDescription(data.description ?? "");
            this.setStatus(data.status ?? "public");
            this.setMode(data.mode ?? "available");

            if(data.slash)
                this.setSlash(data.slash);
            if(data.chat)
                this.setChat(data.chat);

            this.examples = data.examples ?? [];

            debug(`successfully created command ${this.name}`);
        }
    }

    // getters
    /**
     * get command name
     */
    get name(){ return this.m_name; }

    /**
     * command aliases
     */
    get alias(){ return this.m_alias; }

    /**
     * command description
     */
    get description(){ return this.m_description; }

    /**
     * the status of the command
     */
    get status(){ return this.m_commandStatus; }

    /**
     * command status
     * experimental: only available on development mode
     * public: available on both development and production mode
     * private: only available on several members
     */
    get commandStatus(){ return this.m_commandStatus; }

    /**
     * slash JSON data
     */
    get slash(){
        return this.m_slash;
    }

    /**
     * get the command mode
     */
    get mode(){ return this.m_mode; }

    // setters
    /**
     * sets a new command name (will be changed to lowercase)
     * @param newName new command name
     * @returns this
     */
    setName(newName: string){
        this.m_name = newName.toLowerCase();

        return this;
    }

    setExamples(examples: ExampleField[]){
        this.examples = examples;

        return this;
    }

    /**
     * sets a new command description
     * @param description command description
     * @returns this
     */
    setDescription(description: string){
        this.m_description = description;

        return this;
    }

    /**
     * updates command status
     * @param status new command status
     * @returns this
     */
    setStatus(status: CommandStatus){
        this.m_commandStatus = status;

        return this;
    }

    /**
     * set the command mode
     * @param mode new command mode
     * @returns this
    */
    setMode(mode: Mode){
        this.m_mode = mode;

        return this;
    }

    /**
     * adds array of aliases to the command
     * @param aliases array of new aliases
     * @returns this
     */
    setAlias(aliases: string[]){
        for(const ali of aliases){
            this.addAlias(ali);
        }

        return this;
    }

    /**
     * add a new alias to the command
     * @param alias new alias
     */
    addAlias(alias: string){
        alias = alias.toLowerCase();

        if(this.m_alias.find((x) => x === alias))
            console.log(`Alias ${alias} already exist, skipping alias creation`);
        else
            this.m_alias.push(alias);

        return this;
    }

    /**
     * remove an alias from the command
     * @param alias alias to be removed
     */
    removeAlias(alias: string | number){
        if(typeof alias === "number"){
            if(this.m_alias.length < alias && alias >= 0)
                throw new Error(`Alias index out of bounds, please choose between 0 to ${this.m_alias.length - 1}`);

            this.m_alias = this.m_alias.filter((_, index) => index !== alias);
        }
        else{
            this.m_alias = this.m_alias.filter((x) => x !== alias);
        }

        return this;
    }

    /**
     * sets a new slash command
     * @param slash slash command
     * @returns this
     */
    setSlash(slash: {
        slashCommand?: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
        interact: (interaction: ChatInputCommandInteraction<CacheType>, args?: _T) => Promise<Cause | void>;
        getParameter?: (interaction: ChatInputCommandInteraction<CacheType>) => _T;
    }){
        // if there's no slash command, then make new one
        // this only works when there's no parameter for the slash command
        if(slash.slashCommand){
            this.m_slash = slash as I_SlashCommand<_T>;
        }
        else{
            const slashCommand = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
            this.m_slash = {...slash, slashCommand};
        }

        return this;
    }

    /**
     * sets a new chat command
     * @param chat chat command
     * @returns this
     */
    setChat(chat: I_ChatCommand<_T>){
        this.m_chat = chat;

        return this;
    }

    // methods
    async execute(message: ChatInputCommandInteraction<CacheType>): Promise<void | Cause | undefined>;
    async execute(message: Message<boolean>, args: string[]): Promise<void | Cause | undefined>
    async execute(message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: string[]){
        let params: _T | undefined = undefined;
        if(isChatInputCommandInteraction(message)){
            debug(`running command /${this.name}`);

            if(this.m_slash === undefined) return new Cause(false, "slash option is not available for this command");

            params = this.m_slash.getParameter?.(message);
            return await this.m_slash.interact(message, params);
        }
        else{
            debug(`running command ${this.name}`);
            if(args === undefined) return new Cause(false, "command arguments are not provided");
            if(this.m_chat === undefined) return new Cause(false, "chat option is not available for this command");

            params = this.m_chat.getParameter?.(message, args);
            return await this.m_chat.execute(message, params);
        }
    }

    /**
     * checks if the string given is the command name or alias
     * @param commandName a string command or alias
     * @returns boolean
     */
    checkIfCommand(commandName: string){
        return this.m_name === commandName || this.m_alias.find((x) => x === commandName) !== undefined;
    }
}