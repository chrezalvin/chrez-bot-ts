import { MODE } from "@config";
import User from "./models/user";
import Event from "./models/event";

const models = [
    User,
    Event
];

const isDev = MODE !== "production";

export const init = (async () => {
    for(const model of models){
        console.log(`syncing ${model.getTableName()}`);
        await model.sync({alter: isDev, logging: false,});
    }
});

export *  from "./models/user";
export *  from "./models/event";