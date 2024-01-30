import {inlineCommandReturnTypes} from "library/customTypes";
import { rngInt } from "@library/basicFunctions";

const dontYellMessages = [
    "Don't yell D:",
    "Don't yell please",
    "Don't yell DDDD::::",
    "Stop yelling D:",
    "Please Don't yell :(",
    "Stop yelling DDDD::::"
]

const command: inlineCommandReturnTypes = {
    name: "dontyell",
    // checks if all the text is in caps
    searchCriteria: [/([A-Z]('| |!|\?)?){10,}/],
    description: "Asks the user to not yell",
    execute: async (message) => {
        let dontyell: string  = dontYellMessages[rngInt(0, dontYellMessages.length - 1)];

        await message.channel.send(dontyell);
    }
};

export default command;