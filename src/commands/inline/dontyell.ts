import {InlineCommandReturnTypes, rngInt} from "@library";

const dontYellMessages = [
    "Don't yell D:",
    "Don't yell please",
    "Don't yell DDDD::::",
    "Stop yelling D:",
    "Please Don't yell :(",
    "Stop yelling DDDD::::"
]

const command: InlineCommandReturnTypes = {
    name: "dontyell",
    // checks if all the text is in caps
    searchCriteria: [/([A-Z]('| |!|\?)?){20,}/],
    description: "Asks the user to not yell",
    execute: async (message) => {
        let dontyell: string  = dontYellMessages[rngInt(0, dontYellMessages.length - 1)];

        message.reply({
            allowedMentions: { repliedUser: false },
            content: dontyell,
        });
    }
};

export default command;