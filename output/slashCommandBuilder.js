"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const readline = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
// const question = util.promisify(readline.question).bind(readline);
// locally asks for prompt
function question(message) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            readline.question(message, (ans) => __awaiter(this, void 0, void 0, function* () {
                readline.close();
                readline.removeAllListeners();
                res(ans);
            }));
        });
    });
}
function importModule(path, ensureType) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let imported = yield (_a = `${path}`, Promise.resolve().then(() => __importStar(require(_a))));
        imported = imported.default;
        if (!ensureType)
            return imported;
        else if (ensureType && ensureType(imported))
            return imported;
        else
            throw new Error("imported path is not the expected type");
    });
}
// checking discord token
const { mode } = process.env; // production | development
if (process.env.DISCORD_TOKEN === undefined)
    throw new Error("no token set on environtment variable!");
const files = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "./commands"));
const slashCommands = [];
const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const file of files) {
            const { slash } = yield importModule(`./commands/${file}`);
            if (slash !== undefined)
                slashCommands.push(slash.slashCommand);
        }
        // Create preview for slash commands
        console.log("getting all the slash commands, here's the list of all the commands:\n" +
            slashCommands.map(slashCommand => {
                return `${slashCommand.name} - ${slashCommand.description}`;
            }).join("\n"));
        let data = [];
        if (process.env.APPLICATION_ID === undefined)
            throw new Error("couldn't find the application id for this environtment!");
        const answer = yield question("Note: This process will refresh all your slash command on discord server, do you wish to proceed?\n(y/n | yes/no): ");
        if (answer === 'n' || answer === "no") {
            console.log("exiting the process");
            process.exit(0);
        }
        console.log("updating the slash commands to discord server");
        data = (yield rest.put(discord_js_1.Routes.applicationCommands(process.env.APPLICATION_ID), { body: slashCommands }));
        console.log(`successfully reloaded ${data.length} of data`);
    }
    catch (error) {
        if (typeof error === "object" && 'message' in error) {
            console.log(`error: ${error.message}`);
        }
        else
            console.log(`Error: ${error}`);
    }
}))();
