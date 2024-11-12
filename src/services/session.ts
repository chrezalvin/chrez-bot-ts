import client from "@bot";
import { ServiceSupabase } from "@library";
import { isSession, isSessionView, Session, SessionView } from "@models";

export class SessionService{
    protected static readonly sessionViewPath = "sessions_view";
    protected static readonly sessionPath = "sessions";
    static sessionViewSupabase = new ServiceSupabase<SessionView, "id">("id", SessionService.sessionViewPath, {
        typeGuard: isSessionView,
        useCache: false,
    });

    static sessionSupabase = new ServiceSupabase<Session, "id">("id", SessionService.sessionPath, {
        typeGuard: isSession,
        useCache: false,
    });

    static async getSession(id: string): Promise<SessionView>{
        const res = await SessionService.sessionViewSupabase.get(id);

        if(!res)
            throw new Error("Session not found");

        return res;
    }

    static async deleteSession(id: string): Promise<void>{
        await SessionService.sessionSupabase.delete(id);
    }

    static async setNewSession(userId: string): Promise<SessionView>{
        // time 2 hours from now
        const time = new Date();

        // add 2 hours
        time.setTime(time.getTime() + 2 * 60 * 60 * 1000);

        const user = await client.users.fetch(userId);
        const userAvatar = user.avatarURL();

        // session expired 2 hours from now
        const session = await SessionService.sessionSupabase.add({
            ends_at: time.toISOString(),
            user_id: userId,
            avatar_url: userAvatar,
        });

        if(!session)
            throw new Error("Failed to create a new session");

        const res = await SessionService.sessionViewSupabase.get(session.id);

        if(!res)
            throw new Error("Session not found");

        return res;
    }
}

export default SessionService;