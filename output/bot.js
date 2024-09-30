"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.sendError = sendError;
// idk why it wouldnt work on es6 import smh
const debug = require("debug")("ChrezBot:bot");
const _config_1 = require("./config");
const discord_js_1 = require("discord.js");
const _library_1 = require("./library");
const _library_2 = require("./library");
const events_1 = __importDefault(require("./events"));
const autoWorkers_1 = __importDefault(require("./autoWorkers"));
exports.client = new discord_js_1.Client({ intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ] });
exports.client.once("messageCreate", (message) => {
    if (message.channel.isSendable())
        message.channel.send("bot is online");
});
for (const botEvent of events_1.default) {
    for (const execute of botEvent.execute) {
        debug(`created event ${botEvent.name} ${execute[0]}`);
        exports.client[botEvent.name](...execute);
    }
}
async function sendError(message, errorMessage, deleteTime = _config_1.message_delete_time) {
    const embed = _library_2.MyEmbedBuilder.createError({
        description: `**${errorMessage}**`,
        footer: `this message will be deleted in ${deleteTime} seconds`
    });
    if ((0, _library_1.isChatInputCommandInteraction)(message)) {
        message.deferred ? await message.editReply({ embeds: [embed] }) : await message.reply({ embeds: [embed] });
        if (deleteTime)
            setTimeout(async () => {
                message.deleteReply();
            }, deleteTime * 1000);
    }
    else if (message.channel.isSendable()) {
        const msg = await message.channel.send({ embeds: [embed] });
        if (deleteTime)
            setTimeout(async () => {
                if (msg.deletable)
                    await msg.delete();
            }, deleteTime * 1000);
    }
}
debug("adding autoWorkers...");
for (const autoWorker of autoWorkers_1.default)
    try {
        debug(`registering autoworker ${autoWorker.name}`);
        autoWorker(exports.client);
        debug(`autoworker ${autoWorker.name} has been registered successfully`);
    }
    catch (e) {
        if (typeof e === "object" && e !== null)
            if ("message" in e) {
                if (typeof e.message === "string" || Array.isArray(e.message))
                    console.error(`error at autoWorker ${autoWorker.name}: ${e.message}`);
            }
            else
                console.error(`unknown error at autoWorker ${autoWorker.name}`);
    }
debug("Sucessfully added autoWorkers");
debug(`list of active autoWorkers: ${autoWorkers_1.default.map(w => w.name)}`);
process.on("unhandledRejection", async (error, _) => {
    console.log(`fatal error: ${JSON.stringify(error)}`);
});
exports.client.login(_config_1.DISCORD_TOKEN);
exports.default = exports.client;
//# sourceMappingURL=bot.js.map