"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate_get = authenticate_get;
exports.authenticate_post = authenticate_post;
exports.authenticate_server = authenticate_server;
exports.getUserProfile = getUserProfile;
const debug = require("debug")("Server:authenticate");
const _config_1 = require("../../config");
const UserSessions_1 = require("../../shared/UserSessions");
const crypto_1 = __importDefault(require("crypto"));
const authenticate_1 = require("../../services/authenticate");
const users_1 = require("../../services/users");
async function authenticate_get(req, res, next) {
    const accessCode = req.query.code;
    if (typeof accessCode !== "string") {
        debug("no accesscode error thrown");
        throw new Error("No accesscode given");
    }
    debug(`got accessCode ${accessCode}`);
    const oauth2Response = await (0, authenticate_1.requestOauth2)({
        code: accessCode,
        redirect_uri: _config_1.OAUTH2_REDIRECT_URL,
        scope: "Identify"
    });
    const user = await (0, authenticate_1.collectUserData)(oauth2Response);
    const resUser = await users_1.UserService.getUser(user.id);
    if (!users_1.UserService.userIsAdmin(user.id)) {
        debug(`user ${user.username} tried to login but is not an admin`);
        throw new Error("User is not an admin");
    }
    debug(`collected user ${user.username} - ${user.id}`);
    const sessionID = crypto_1.default.randomUUID();
    UserSessions_1.sessions.addData(sessionID, resUser);
    res.json({ sessionID });
}
async function authenticate_post(req, res, next) {
    if (req.body.SESSION_KEY !== undefined) {
        const SESSION_KEY = req.body.SESSION_KEY;
        const find = UserSessions_1.sessions.get(SESSION_KEY);
        if (find) {
            debug(`got sessionkey for user: ${find.username}`);
            res.json(find);
        }
        else {
            debug(`cannot find the user from session_key`);
            throw new Error("SESSION_KEY not found");
        }
    }
    else
        throw new Error("no SESSION_KEY provided");
}
async function authenticate_server(req, res, next) {
    const accessCode = req.query.code;
    if (typeof accessCode !== "string") {
        debug("no accesscode error thrown");
        throw new Error("No accesscode given");
    }
    debug(`got accessCode ${accessCode}`);
    const oauth2Response = await (0, authenticate_1.requestOauth2)({
        code: accessCode,
        redirect_uri: _config_1.OAUTH2_REDIRECT_URL_SERVER,
        scope: "Identify"
    });
    const user = await (0, authenticate_1.collectUserData)(oauth2Response);
    const resUser = await users_1.UserService.getUser(user.id);
    if (!users_1.UserService.userIsAdmin(user.id)) {
        debug(`user ${user.username} tried to login but is not admin`);
        throw new Error("User is not admin");
    }
    debug(`collected user ${user.username} - ${user.id}`);
    const sessionID = crypto_1.default.randomUUID();
    UserSessions_1.sessions.addData(sessionID, resUser);
    res.json({ sessionID });
}
async function getUserProfile(req, res, next) {
    const sessionid = req.cookies.sessionid;
    if (typeof sessionid === "string") {
        const userSession = UserSessions_1.sessions.get(sessionid);
        if (userSession !== undefined) {
            res.json(userSession);
        }
        else
            res.status(401).send({ error: 401, message: "Unauthorized!" });
    }
    else
        res.status(401).send({ error: 401, message: "Unauthorized!" });
}
//# sourceMappingURL=authenticate.js.map