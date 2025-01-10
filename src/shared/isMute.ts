// muted variable to share across all modules
/**
 * whether the bot is muted or not
 */
export let muted = false;

let timerMuted: NodeJS.Timeout| null = null;

export function setMute(set: boolean, callback?: () => void){
    if(timerMuted === null){
        if(set)
            timerMuted = setTimeout(() => {
                muted = false;
                timerMuted = null;
                if(callback)
                    callback();
            }, 60 * 10 * 1000);
    }
    else{
        if(set){
            clearTimeout(timerMuted);
            timerMuted = setTimeout(() => {
                muted = false;
                timerMuted = null;
                if(callback)
                    callback();
            }, 60 * 10);
        }
        else{
            clearTimeout(timerMuted);
            timerMuted = null;
        }
    }
    muted = set;
}