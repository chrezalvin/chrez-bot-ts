"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reloadDatabase;
const _library_1 = require("../library");
const cron_1 = require("cron");
// reload the whole cache everyday
function reloadDatabase(client) {
    new cron_1.CronJob("0 0 * * *", async () => {
        console.log("reloading all cache");
        for (const service of _library_1.ServiceSupabase.s_services)
            await service.getAll(); // this will trigger all cache collect
        for (const fileManager of _library_1.FileManagerSupabase.s_fileManagers)
            await fileManager.getAllFiles(); // same here
        console.log("successfully reloaded all cache");
    }, null, true, "Japan");
}
//# sourceMappingURL=reloadDatabase.js.map