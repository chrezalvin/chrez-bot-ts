"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const _library_1 = require("../../library");
const _config_1 = require("../../config");
const _services_1 = require("../../services");
// , privateCommands: CommandReturnTypes[]
function help(index, privateCommands) {
    const run = async (message, args) => {
        let command = args?.command ?? null;
        const embed = new _library_1.MyEmbedBuilder();
        if (command === null) {
            // displays all active commands
            embed.setTitle("Chrez-Bot active command help menu")
                .setDescription("here are the list of commands that chrezbot can use")
                .setFields(index.map(idx => { return { name: `\`${_config_1.prefixes[0]} ${idx.name}\``, value: idx.description, inline: true }; }));
        }
        else if (command === "private") {
            let user;
            if ((0, _library_1.isChatInputCommandInteraction)(message))
                user = message.user;
            else
                user = message.author;
            if (!_services_1.UserService.userIsAdmin(user.id))
                throw new Error("You're not a private member");
            embed.setTitle("Hold it!")
                .setDescription("Due to security concerns, Chrez-Bot won't send command menu here!\nI've send private command help menu to your DM, check it out!");
            user.send({ embeds: [
                    new _library_1.MyEmbedBuilder()
                        .setTitle("Chrez-Bot private command help menu")
                        .setDescription("here are the list of private commands that chrezbot can use")
                        .setFields(privateCommands.map(idx => { return { name: `\`${_config_1.prefixes[0]} ${idx.name}\``, value: idx.description, inline: true }; }))
                ] });
        }
        else {
            const find = index.find(idx => {
                if (idx.name === command)
                    return true;
                if (idx.alias)
                    return idx.alias.find(al => al === command) !== undefined;
                return false;
            });
            if (find === undefined)
                throw new Error("Cannot find the active command or its aliases!");
            embed.setTitle(`${_config_1.prefixes[0]} ${find.name} ${find.slash ? `or \`/${find.slash?.slashCommand.name}\`` : ""}`)
                .setDescription(find.description);
            if (find.examples && find.examples.length > 0) {
                embed.addFields({ name: "Examples", value: "\u200B" });
                embed.addFields(find.examples.map(example => { return { name: example.command, value: example.description ?? "\u200B", inline: true }; }));
            }
            if (find.alias)
                embed.setFooter({ text: `possible alias for this command: ${find.alias.map(al => `\`${_config_1.prefixes[0]} ${al}\``).join(", ")}` });
        }
        return [embed];
    };
    const slashCommand = new discord_js_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("give all commands for chrezbot or specify which command to check").
        addStringOption(opt => {
        opt.setName("command").setDescription("command to check");
        for (const idx of index)
            opt.addChoices({ name: `${_config_1.prefixes[0]} ${idx.name}`, value: idx.name });
        return opt;
    });
    const chrezHelp = new _library_1.CommandBuilder()
        .setName("help")
        .setAlias(["h", "manual"])
        .setDescription("give all commands for chrezbot")
        .setSlash({
        slashCommand,
        interact: async (interaction, args) => {
            const embeds = await run(interaction, args);
            await interaction.reply({ embeds });
        },
        getParameter: (interaction) => {
            const command = interaction.options.getString("command", false);
            return { command };
        }
    })
        .setChat({
        execute: async (message, args) => {
            const embeds = await run(message, args);
            await message.channel.send({ embeds });
        },
        getParameter: (_, args) => {
            let command = null;
            if (args && args[0] !== undefined)
                command = args[0];
            return { command };
        }
    });
    return chrezHelp;
}
;
exports.default = help;
//# sourceMappingURL=help.js.map