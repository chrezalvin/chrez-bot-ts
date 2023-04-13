const debug = require("debug")("ChrezBot:index");
import {init} from "@database";

// immediate function to sanitize databases
(async function(){
    debug("creating database");
    await init();
    debug("Database sucessfully created");
})();

import "./bot";
import "./server";