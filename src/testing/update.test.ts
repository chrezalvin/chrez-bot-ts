import { supabase } from "../config";
import {isUpdate, Update} from "../models/Update";

const dummyUpdate: Update = {
    version: "1.0.0",
    bugfix: ["Fixing bugs"],
    news: ["New features"]
}

const dummyUpdateMinimal: Update = {
    version: "1.0.0",
    bugfix: null,
    news: null
}   

const dummyUpdateWrong = {
    version: "1.0.0",
    bugfix: ["Fixing bugs"],
    news: "New features"
}

describe("Update Test", () => {
    test("with dummy data", () => {
        expect(isUpdate(dummyUpdate)).toBe(true);
    });

    test("with minimal dummy data", () => {
        expect(isUpdate(dummyUpdateMinimal)).toBe(true);
    });

    test("with wrong dummy data", () => {
        expect(isUpdate(dummyUpdateWrong)).toBe(false);
    });

    test("with database data", async () => {
        const res = await supabase.from("updates").select("*");

        if(res.data !== null)
            for(const item of res.data){
                expect(isUpdate(item)).toBe(true);
            }
    })
});