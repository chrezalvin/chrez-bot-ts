import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { isChatInputCommandInteraction, ErrorValidation } from "@library";
import { SenddableMessage } from "./CustomTypes";
const debug = require("debug")("ChrezBot:command");

export interface ExampleField{
    command: string;
    description?: string;
}

enum CommandStatuses{
    public,
    private,
    hidden,
}

enum Modes{
    available,
    unavailable,
    experimental,
}

export type CommandStatus = keyof typeof CommandStatuses;
export type Mode = keyof typeof Modes;

export interface I_SlashCommand<_T> {
    slashCommand: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandOptionsOnlyBuilder;
    interact: (interaction: ChatInputCommandInteraction<CacheType>, args?: _T) => Promise<ErrorValidation | void>;
    getParameter?: (interaction: ChatInputCommandInteraction<CacheType>) => (_T | ErrorValidation);
}

export interface I_ChatCommand<_T> {
    execute: (message: SenddableMessage, args?: _T) => Promise<ErrorValidation | void>;
    getParameter?: (message: SenddableMessage, args: string[]) => (_T | ErrorValidation);
}

export interface CommandData<_T>{
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

    protected m_mode: CommandData<_T>["mode"] = "available";
    protected m_name: CommandData<_T>["name"] = "";
    protected m_alias: CommandData<_T>["alias"] = [];
    protected m_description: CommandData<_T>["description"] = "";
    protected m_slash: CommandData<_T>["slash"] = undefined;
    protected m_chat: CommandData<_T>["chat"] = undefined;
    protected m_commandStatus: CommandData<_T>["status"] = "public";

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
    get description(){ return `${this.m_mode !== "available" ? `(${this.m_mode})` : ""} ${this.m_description}`; }

    /**
     * command status
     * experimental: only available on development mode
     * public: available on both development and production mode
     * private: only available on several members
     * hidden: will not be shown on Chrez help or slash command
     */
    get status(){ return this.m_commandStatus; }

    /**
     * slash JSON data
     */
    get slash(){
        return this.m_slash;
    }

    /**
     * chat JSON data
     */
    get chat(){
        return this.m_chat;
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

    /**
     * replaces the examples with a new one
     * @param examples array of new example data
     */
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
     */
    setSlash(slash: {
        slashCommand?: I_SlashCommand<_T>["slashCommand"];
        interact: I_SlashCommand<_T>["interact"];
        getParameter?: I_SlashCommand<_T>["getParameter"];
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
     */
    setChat(chat: I_ChatCommand<_T>){
        this.m_chat = chat;

        return this;
    }

    // methods
    async execute(message: ChatInputCommandInteraction<CacheType>): Promise<void | ErrorValidation | undefined>;
    async execute(message: SenddableMessage, args: string[]): Promise<void | ErrorValidation | undefined>
    async execute(message: SenddableMessage | ChatInputCommandInteraction<CacheType>, args?: string[]){
        let params: _T | undefined | ErrorValidation = undefined;

        if(isChatInputCommandInteraction(message)){
            debug(`running command /${this.name}`);

            if(this.m_slash === undefined) return new ErrorValidation("slash_command_option_unavailable");

            params = this.m_slash.getParameter?.(message);

            if(ErrorValidation.isErrorValidation(params)){
                debug(`received an error from ${this.name}: ${params.name} - ${params.description}`);
                return params;
            }

            debug(`slash params: ${JSON.stringify(params)}`);

            return await this.m_slash.interact(message, params);
        }
        else{
            debug(`running command ${this.name}`);
            if(args === undefined) return new ErrorValidation("no_argument_provided"); 
            if(this.m_chat === undefined) return new ErrorValidation("no_argument_provided");

            params = this.m_chat.getParameter?.(message, args);

            if(ErrorValidation.isErrorValidation(params)){
                debug(`received an error from ${this.name}: ${params.name} - ${params.description}`);
                return params;
            }

            debug(`chat params: ${JSON.stringify(params)}`);
            
            return await this.m_chat.execute(message, params);
        }
    }

    /**
     * checks if the string given is the command name or alias
     * @param commandName a string command or alias
     * @returns true or false if the commandName is the command name or alias of this command
     */
    checkIfCommand(commandName: string){
        return this.m_name === commandName || this.m_alias.find((x) => x === commandName) !== undefined;
    }
}