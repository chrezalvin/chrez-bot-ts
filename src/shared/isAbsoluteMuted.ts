// muted variable to share across all modules
/**
 * whether the bot is muted or not
 */
export let absoluteMuted = false;

export function setAbsoluteMute(set: boolean){
    absoluteMuted = set;
}