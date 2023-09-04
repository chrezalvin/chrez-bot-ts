import {inlineCommandReturnTypes} from "@typings/customTypes";
import yayData from "@assets/data/yays.json";
import { rng, rngInt } from "@modules/basicFunctions";

const command: inlineCommandReturnTypes = {
    name: "yay",
    description: "yays whenever users says yay",
    searchCriteria: [/^y(a|e)*y/i, /yeeee+s/i],
    execute: (message) => {
        message.channel.send(yayData.yays[rngInt(0, yayData.yays.length - 1)]);
    },
};

export default command;