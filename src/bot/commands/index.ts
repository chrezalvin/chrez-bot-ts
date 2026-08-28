import {
    active_slash_commands,
    private_slash_commands,
    experimental_slash_commands,
} from "./slash";
import {
    active_chat_commands,
    hidden_chat_commands,
    private_chat_commands,
    experimental_chat_commands,
} from "./chat";
import {chrezHelp} from "./help";

const help_command = chrezHelp(
    active_chat_commands.map(e => e.chat), 
    private_chat_commands.map(e => e.chat),
);

export const chat_commands = [
    ...active_chat_commands, 
    ...hidden_chat_commands, 
    ...private_chat_commands,
    ...experimental_chat_commands,
    help_command.chat,
];
export const slash_commands = [
    ...active_slash_commands, 
    ...private_slash_commands, 
    ...experimental_slash_commands,
    help_command.slash,
];
export {
    inline_commands
} from "./inline";