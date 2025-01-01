import { StrictOmit } from "@library/CustomTypes";
import { isPartialSession, isSession, isSessionWithoutId, Session } from "./Session";
import { isPartialUser, isUser, isUserWithoutId, User } from "./User";

// using type union to prevent duck typing
export interface SessionView extends Session, User{

}

export function isSessionView(value: unknown): value is SessionView{
    if(!isUser(value))
        return false;
    
    if(!isSession(value))
        return false;

    return true;
}

export function isSessionViewWithoutId(value: unknown): value is StrictOmit<SessionView, "user_id" | "session_id">{
    if(!isUserWithoutId(value))
        return false;

    if(!isSessionWithoutId(value))
        return false;

    return true;
}

export function isPartialSessionView(value: unknown): value is Partial<SessionView>{
    if(!isPartialUser(value))
        return false;

    if(!isPartialSession(value))
        return false;

    return true;
}