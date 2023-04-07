import { MODE } from "@config";
import User from "./user";
import Event from "./event";

const models = [
    User,
    Event
];

const isDev = MODE !== "production";

export const init = (async () => {
    for(const model of models){
        console.log(`syncing ${model.getTableName()}`);
        await model.sync({force: true});
    }
});

export {default as User} from "./user";
export {default as Event} from "./event";