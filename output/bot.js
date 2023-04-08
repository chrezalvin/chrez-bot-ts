"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
// idk why it wouldnt work on es6 import smh
const debug = require("debug")("ChrezBot:bot");
const _config_1 = require("./config");
const discord_js_1 = require("discord.js");
const commands_1 = __importDefault(require("./commands/"));
const basicFunctions_1 = require("./modules/basicFunctions");
const _command = new discord_js_1.Collection();
const _commandAlias = new discord_js_1.Collection();
const _slashCommands = new discord_js_1.Collection();
const _privateCommands = new discord_js_1.Collection();
const _privateCommandAlias = new discord_js_1.Collection();
const _privateSlashCommands = new discord_js_1.Collection();
const _aliasCriteriaMap = new discord_js_1.Collection();
const _inlineCommands = new discord_js_1.Collection();
debug("Loading active commands");
for (const command of commands_1.default.active) {
    _command.set(command.name, command);
    if (command.slash)
        _slashCommands.set(command.slash.slashCommand.name, command.slash);
    if (command.alias)
        for (const alias of command.alias) {
            if (_commandAlias.has(alias)) {
                console.warn(`WARNING: The alias ${alias} in Chrez ${command.name} has already been taken by command ${_commandAlias.get(alias)}, skipping this alias`);
                continue;
            }
            _commandAlias.set(alias, command.name);
        }
}
debug("Done loading active commands");
debug("Loading private commands");
for (const command of commands_1.default.c_private) {
    _privateCommands.set(command.name, command);
    if (command.slash)
        _privateSlashCommands.set(command.slash.slashCommand.name, command.slash);
    if (command.alias)
        for (const alias of command.alias) {
            if (_privateCommandAlias.has(alias)) {
                console.warn(`WARNING: The alias for private command ${alias} has already been taken by command ${_privateCommandAlias.get(alias)}, skipping this alias`);
                continue;
            }
            _privateCommandAlias.set(alias, command.name);
        }
}
debug("Done loading private commands");
debug("Loading Inline Commands");
for (const inline of commands_1.default.inline) {
    for (const criteria of inline.searchCriteria)
        _aliasCriteriaMap.set(criteria, inline.name);
    _inlineCommands.set(inline.name, inline);
}
debug("Done loading inline Commands");
if (_config_1.MODE === "development") {
    console.log("On development mode, adding experimental commands");
    for (const command of commands_1.default.experimental.commands) {
        _command.set(command.name, command);
        if (command.slash) {
            console.log(command.slash.slashCommand.name);
            _slashCommands.set(command.slash.slashCommand.name, command.slash);
        }
        if (command.alias)
            for (const alias of command.alias) {
                if (_commandAlias.has(alias)) {
                    console.warn(`WARNING: The alias for command ${alias} has already been taken by command ${_commandAlias.get(alias)}, skipping this alias`);
                    continue;
                }
                _commandAlias.set(alias, command.name);
            }
    }
    for (const inline of commands_1.default.experimental.inlines) {
        for (const criteria of inline.searchCriteria)
            _aliasCriteriaMap.set(criteria, inline.name);
        _inlineCommands.set(inline.name, inline);
    }
    debug("Done loading experimental commands");
}
debug("======= list of commands =======");
debug(`create Message: ${_command.map((_, key) => key)}`);
debug(`slash Commands: ${_slashCommands.map((_, key) => key)}`);
debug(`inline Commands: ${_inlineCommands.map((_, key) => key)}`);
debug(`private Commands: ${_privateCommands.map((_, key) => key)}`);
exports.client = new discord_js_1.Client({ intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ] });
console.log(`Bot running on mode ${_config_1.MODE}`);
exports.client.once("ready", () => {
    console.log("Bot ready!");
    debug(`discord.js version: ${discord_js_1.version}\nbot version: ${_config_1.botVersion}`);
});
exports.client.on("messageCreate", async (message) => {
    if (!message.guild?.members.me?.permissions.has("ManageMessages"))
        return;
    // ignore message from bot or long message
    if (message.author.bot || message.content.length > 300)
        return;
    // inline command handling
    for (const [v, k] of _aliasCriteriaMap) {
        if (typeof v === "string")
            if (message.content === v) {
                _inlineCommands.get(k)?.execute(message);
                return;
            }
        if (v instanceof RegExp)
            if (message.content.match(v) !== null) {
                _inlineCommands.get(k)?.execute(message);
                return;
            }
    }
    if (_config_1.prefixes.find(prefix => message.content.startsWith(prefix)) === undefined)
        return;
    const args = message.content.split(/ +/);
    args.shift();
    debug(`got message: ${message.content}`);
    debug(`args: ${args}`);
    const command = args.shift();
    // check if command available
    if (command === undefined)
        return;
    try {
        if (_command.has(command))
            await _command.get(command)?.execute(message, args);
        else if (_commandAlias.has(command))
            await _command.get(_commandAlias.get(command))?.execute(message, args);
        else if (_privateCommands.has(command)) {
            if (message.author.id === _config_1.ownerID)
                await _privateCommands.get(command)?.execute(message, args);
            else
                throw new Error("This command is for private members only!");
        }
        else if (_privateCommandAlias.has(command)) {
            if (message.author.id === _config_1.ownerID)
                await _privateCommands.get(_privateCommandAlias.get(command))?.execute(message, args);
            else
                throw new Error("This command is for private members only!");
        }
        else
            throw new Error("Your command is not available in Chrez Command List");
    }
    catch (e) {
        const embed = new basicFunctions_1.MyEmbedBuilder();
        const deleteTime = 10;
        if (e.message && typeof e.message === "string")
            embed.setError({ description: `**${e.message}**`, footer: "this message will be deleted in 10 seconds" });
        const msg = await message.channel.send({ embeds: [embed] });
        setTimeout(() => {
            if (msg.deletable)
                msg.delete();
        }, deleteTime * 1000);
    }
});
exports.client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    debug(`received interaction: /${interaction.commandName} from ${interaction.member?.user.username}`);
    try {
        if (_slashCommands.has(interaction.commandName))
            await _slashCommands.get(interaction.commandName)?.interact(interaction);
        else if (_privateSlashCommands.has(interaction.commandName)) {
            if (!interaction.member)
                return;
            if (interaction.member.user.id === _config_1.ownerID)
                await _privateSlashCommands.get(interaction.commandName)?.interact(interaction);
            else
                throw new Error("This command is for private members only!");
        }
        else {
            const embed = new basicFunctions_1.MyEmbedBuilder();
            embed.setError({ description: `The slash command is still unavailable!`, footer: "please wait for upcoming release to use this command" });
            await interaction.reply({ embeds: [embed] });
        }
    }
    catch (e) {
        const embed = new basicFunctions_1.MyEmbedBuilder();
        const deleteTime = 10;
        if (e.message && typeof e.message === "string")
            embed.setError({ description: `**${e.message}**`, footer: "This message will be deleted within 10 seconds" });
        await interaction.reply({ embeds: [embed] });
        setTimeout(() => {
            interaction.deleteReply();
        }, deleteTime * 1000);
    }
});
exports.client.login(_config_1.DISCORD_TOKEN);
