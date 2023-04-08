"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("ChrezBot:index");
const _database_1 = require("./db");
// immediate function to sanitize databases
(async function () {
    debug("creating database");
    await (0, _database_1.init)();
    debug("Database sucessfully created");
})();
require("./bot");
require("./server");
