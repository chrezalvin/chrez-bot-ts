"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBuilder = void 0;
const discord_js_1 = require("discord.js");
const customTypes_1 = require("../typings/customTypes");
const debug = require("debug")("ChrezBot:command");
var CommandStatuses;
(function (CommandStatuses) {
    CommandStatuses[CommandStatuses["public"] = 0] = "public";
    CommandStatuses[CommandStatuses["private"] = 1] = "private";
})(CommandStatuses || (CommandStatuses = {}));
var Modes;
(function (Modes) {
    Modes[Modes["available"] = 0] = "available";
    Modes[Modes["unavailable"] = 1] = "unavailable";
    Modes[Modes["experimental"] = 2] = "experimental";
})(Modes || (Modes = {}));
class CommandBuilder {
    /**
     * Typeguard for CommandBuilder
     */
    static isCommandBuilder(object) {
        return object instanceof CommandBuilder;
    }
    constructor(data) {
        this.m_mode = "experimental";
        this.m_name = "";
        this.m_alias = [];
        this.m_description = "";
        this.m_slash = undefined;
        this.m_chat = undefined;
        this.m_commandStatus = "public";
        this.examples = [];
        if (data) {
            this.setName(data.name ?? "");
            this.setAlias(data.alias ?? []);
            this.setDescription(data.description ?? "");
            this.setStatus(data.status ?? "public");
            this.setMode(data.mode ?? "available");
            if (data.slash)
                this.setSlash(data.slash);
            if (data.chat)
                this.setChat(data.chat);
            this.examples = data.examples ?? [];
        }
    }
    // getters
    /**
     * get command name
     */
    get name() { return this.m_name; }
    /**
     * command aliases
     */
    get alias() { return this.m_alias; }
    /**
     * command description
     */
    get description() { return `${this.m_mode !== "available" ? `(${this.m_mode})` : ""} ${this.m_description}`; }
    /**
     * the status of the command
     */
    get status() { return this.m_commandStatus; }
    /**
     * command status
     * experimental: only available on development mode
     * public: available on both development and production mode
     * private: only available on several members
     */
    get commandStatus() { return this.m_commandStatus; }
    /**
     * slash JSON data
     */
    get slash() {
        return this.m_slash;
    }
    /**
     * get the command mode
     */
    get mode() { return this.m_mode; }
    // setters
    /**
     * sets a new command name (will be changed to lowercase)
     * @param newName new command name
     * @returns this
     */
    setName(newName) {
        this.m_name = newName.toLowerCase();
        return this;
    }
    setExamples(examples) {
        this.examples = examples;
        return this;
    }
    /**
     * sets a new command description
     * @param description command description
     * @returns this
     */
    setDescription(description) {
        this.m_description = description;
        return this;
    }
    /**
     * updates command status
     * @param status new command status
     * @returns this
     */
    setStatus(status) {
        this.m_commandStatus = status;
        return this;
    }
    /**
     * set the command mode
     * @param mode new command mode
     * @returns this
    */
    setMode(mode) {
        this.m_mode = mode;
        return this;
    }
    /**
     * adds array of aliases to the command
     * @param aliases array of new aliases
     * @returns this
     */
    setAlias(aliases) {
        for (const ali of aliases) {
            this.addAlias(ali);
        }
        return this;
    }
    /**
     * add a new alias to the command
     * @param alias new alias
     */
    addAlias(alias) {
        alias = alias.toLowerCase();
        if (this.m_alias.find((x) => x === alias))
            console.log(`Alias ${alias} already exist, skipping alias creation`);
        else
            this.m_alias.push(alias);
        return this;
    }
    /**
     * remove an alias from the command
     * @param alias alias to be removed
     */
    removeAlias(alias) {
        if (typeof alias === "number") {
            if (this.m_alias.length < alias && alias >= 0)
                throw new Error(`Alias index out of bounds, please choose between 0 to ${this.m_alias.length - 1}`);
            this.m_alias = this.m_alias.filter((_, index) => index !== alias);
        }
        else {
            this.m_alias = this.m_alias.filter((x) => x !== alias);
        }
        return this;
    }
    /**
     * sets a new slash command
     * @param slash slash command
     * @returns this
     */
    setSlash(slash) {
        // if there's no slash command, then make new one
        // this only works when there's no parameter for the slash command
        if (slash.slashCommand) {
            this.m_slash = slash;
        }
        else {
            const slashCommand = new discord_js_1.SlashCommandBuilder().setName(this.name).setDescription(this.description);
            this.m_slash = { ...slash, slashCommand };
        }
        return this;
    }
    /**
     * sets a new chat command
     * @param chat chat command
     * @returns this
     */
    setChat(chat) {
        this.m_chat = chat;
        return this;
    }
    async execute(message, args) {
        let params = undefined;
        if ((0, customTypes_1.isChatInputCommandInteraction)(message)) {
            debug(`running command /${this.name}`);
            if (this.m_slash === undefined)
                return new customTypes_1.Cause(false, "slash option is not available for this command");
            params = this.m_slash.getParameter?.(message);
            debug(`slash params: ${JSON.stringify(params)}`);
            return await this.m_slash.interact(message, params);
        }
        else {
            debug(`running command ${this.name}`);
            if (args === undefined)
                return new customTypes_1.Cause(false, "command arguments are not provided");
            if (this.m_chat === undefined)
                return new customTypes_1.Cause(false, "chat option is not available for this command");
            params = this.m_chat.getParameter?.(message, args);
            debug(`chat params: ${JSON.stringify(params)}`);
            return await this.m_chat.execute(message, params);
        }
    }
    /**
     * checks if the string given is the command name or alias
     * @param commandName a string command or alias
     * @returns boolean
     */
    checkIfCommand(commandName) {
        return this.m_name === commandName || this.m_alias.find((x) => x === commandName) !== undefined;
    }
}
exports.CommandBuilder = CommandBuilder;
