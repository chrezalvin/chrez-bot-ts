import client from "@bot";
import { ServiceFileSupabase } from "@library";
import { isSession, isSessionView, Session, SessionView } from "@models";
import { supabase } from "@shared/supabase";

export class SessionService{
    protected static readonly sessionViewPath = "sessions_view";
    protected static readonly sessionPath = "sessions";
    static sessionViewSupabase = new ServiceFileSupabase<SessionView, "session_id">(
        supabase,
        "session_id", {
        tableName: SessionService.sessionViewPath,
        typeGuard: isSessionView,
        useCache: false,
    });

    static sessionSupabase = new ServiceFileSupabase<Session, "session_id", "created_at" | "updated_at">(
        supabase,
        "session_id", {
        tableName: SessionService.sessionPath,
        typeGuard: isSession,
        useCache: false,
    });

    static async getSession(id: SessionView["session_id"]): Promise<SessionView>{
        const res = await SessionService.sessionViewSupabase.get(id);
        return res;
    }

    static async deleteSession(id: SessionView["session_id"]): Promise<void>{
        await SessionService.sessionSupabase.delete(id);
    }

    static async setNewSession(userId: SessionView["user_id"]): Promise<SessionView>{
        // time 2 hours from now
        const time = new Date();

        // add 2 hours
        time.setTime(time.getTime() + 2 * 60 * 60 * 1000);

        const user = await client.users.fetch(userId);
        const userAvatar = user.avatarURL();

        // session expired 2 hours from now
        const session = await SessionService.sessionSupabase.add({
            user_id: userId,
            avatar_url: userAvatar,
        });

        if(!session)
            throw new Error("Failed to create a new session");

        const res = await SessionService.sessionViewSupabase.get(session.session_id);

        if(!res)
            throw new Error("Session not found");

        return res;
    }
}

export default SessionService;