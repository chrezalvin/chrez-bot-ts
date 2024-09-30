"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const private_1 = __importDefault(require("../private"));
const hello_1 = __importDefault(require("./hello"));
const roll_1 = __importDefault(require("./roll"));
const calculate_1 = __importDefault(require("./calculate"));
const quote_1 = __importDefault(require("./quote"));
const yomama_1 = __importDefault(require("./yomama"));
const story_1 = __importDefault(require("./story"));
const time_1 = __importDefault(require("./time"));
const memes_1 = __importDefault(require("./memes"));
const cursed_1 = __importDefault(require("./cursed"));
const help_1 = __importDefault(require("./help"));
const update_1 = __importDefault(require("./update"));
const roshambo_1 = __importDefault(require("./roshambo"));
const recommend_1 = __importDefault(require("./recommend"));
const agree_1 = __importDefault(require("./agree"));
const disagree_1 = __importDefault(require("./disagree"));
const laugh_1 = __importDefault(require("./laugh"));
const convert_1 = __importDefault(require("./convert"));
const embedify_1 = __importDefault(require("./embedify"));
const hug_1 = __importDefault(require("./hug"));
const event_1 = __importDefault(require("./event"));
const c = [
    hello_1.default,
    roll_1.default,
    calculate_1.default,
    quote_1.default,
    yomama_1.default,
    story_1.default,
    time_1.default,
    memes_1.default,
    cursed_1.default,
    update_1.default,
    roshambo_1.default,
    recommend_1.default,
    agree_1.default,
    disagree_1.default,
    laugh_1.default,
    embedify_1.default,
    convert_1.default,
    hug_1.default,
    event_1.default,
].filter(command => command.mode !== "unavailable");
// hidden command will not shown on Chrez help
const commandForHelp = c.filter(command => command.status !== "hidden");
const privateCommandForHelp = private_1.default.filter(command => command.status !== "hidden");
// workaround for help command
c.push((0, help_1.default)(commandForHelp, privateCommandForHelp));
exports.commands = c;
exports.default = exports.commands;
//# sourceMappingURL=index.js.map