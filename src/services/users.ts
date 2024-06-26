import { Service } from "@library/Service";

export type Role = "admin" | "vice" | "owner" | "user";
export interface I_User{
    username: string,
    alias: string[],
    discordId: string,
    role: Role,
    birthday?: {
        day: number,
        month: number,
        year?: number,
    },
    timezone?: string,
}

export class UserService {
    protected static dbName = "users";
    static isUser(obj: unknown): obj is I_User{
        if(typeof obj !== "object" || obj === null) return false;

        if(!("discordId" in obj)) return false;
        if(!("username" in obj)) return false;
        if(!("alias" in obj)) return false;
        if("role" in obj){
            switch(obj.role){
                case "admin":
                case "vice":
                case "owner":
                case "user":
                    break;
                default:
                    return false;
            }
        }

        if("birthday" in obj){
            if(typeof obj.birthday !== "object" || obj.birthday === null) return false;
            if(!("day" in obj.birthday)) return false;
            if(!("month" in obj.birthday)) return false;
            if("year" in obj.birthday){
                if(typeof obj.birthday.year !== "number") return false;
            }
        }

        return typeof obj.username === "string" && Array.isArray(obj.alias);
    }

    public static service: Service<I_User> = new Service<I_User>({
        dbName: UserService.dbName,
        typeGuard: UserService.isUser
    });

    public static async getUser(userid: string): Promise<I_User>{
        const find = await UserService.service.getById(userid);

        return find;
    }

    public static async getAllUsers(){
        const find = await UserService.service.getAllData();

        return find;
    }

    public static async setUserRole(userid: string, role: Role){
        // find the user by id
        const user = await UserService.service.getById(userid);

        await UserService.service.updateData(userid, {...user, role: role});
    }

    public static async deleteUser(userid: string){
        await UserService.service.deleteData(userid);
    }

    public static findUser(pred: (user: I_User) => boolean){
        return UserService.service.findFirst(pred);
    }

    public static async createUser(user: I_User, userid: string): Promise<string>{
        return await UserService.service.addData(user, userid);
    }

    public static userIsAdmin(discordId: string): boolean{
        try{
            const user = UserService.service.cache.get(discordId);
            if(!user) throw new Error("User not found");

            switch(user.role){
                case "admin":
                case "vice":
                case "owner":
                    return true;
                default:
                    return false;
            }
        }
        catch(e){
            return false;
        }
    }

    // public static userIsAdmin(user: I_User): boolean{
    //     switch(user.role){
    //         case "admin":
    //         case "vice":
    //         case "owner":
    //             return true;
    //         default:
    //             return false;
    //     }
    // }
}