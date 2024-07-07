import {supabase} from "../../config";
import {isUser, User} from "../../models/User";

const dummyUser: User = {
    id: "696693247350931488",
    username: "chrezalvin",
    timezone: "Asia/Jakarta",
    aliases: ["chrez", "alvin"],
    rolename: "owner"
}

const dummyUserMinimal: User = {
    id: "696693247350931488",
    username: "chrezalvin",
    timezone: null,
    aliases: null,
    rolename: "owner"
}

const dummyUserWrong = {
    id: "696693247350931488",
    username: "chrezalvin",
    timezone: "Asia/Jakarta",
    aliases: ["chrez", "alvin"],
    rolename: "not admin"
}

describe("User Test", () => {
    test("with dummy data", () => {
        expect(isUser(dummyUser)).toBe(true);
    });

    test("with minimal dummy data", () => {
        expect(isUser(dummyUserMinimal)).toBe(true);
    });

    test("with wrong dummy data", () => {
        expect(isUser(dummyUserWrong)).toBe(false);
    });

    test("with database data", async () => {
        const res = await supabase.from("users_view").select("*");

        if(res.data !== null)
            for(const item of res.data){
                expect(isUser(item)).toBe(true);
            }
    })
});