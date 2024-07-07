/**
 * a static class to store state for chrezbot
 */
export class GlobalState{
    /**
     * Default waiting time for setMute to be reset back in minute
     */
    public static readonly default_mute_time_minute: number = 30;

    private static m_isMuted = false;

    private static m_timerMuted: NodeJS.Timeout | null = null;

    // getters

    /**
     * whether chrezbot is muted
     */
    static get isMuted(): boolean{
        return GlobalState.m_isMuted;
    }

    /**
     * sets a state where chrezbot won't respond to inline commands, after 30 minutes, it will be unmuted
     * @param set whether to mute or unmute chrezbot
     * @param callback a callback function to be called after the bot is unmuted
     */
    public static setMute(
        set: boolean, 
        options?: {
            callback?: () => void,
            timeMs?: number
        }
    ): void{
        const time = options?.timeMs || this.default_mute_time_minute * 60 * 1000;

        // if the timer is already assigned, clear it first
        if(GlobalState.m_timerMuted !== null){
            clearTimeout(GlobalState.m_timerMuted);
            GlobalState.m_timerMuted = null;
        }

        // then sets up a new timer if it's going to mute
        if(set)
            GlobalState.m_timerMuted = setTimeout(() => {
                GlobalState.m_isMuted = false;
                GlobalState.m_timerMuted = null;
                options?.callback?.();
            }, time);

        GlobalState.m_isMuted = set;
    }
}