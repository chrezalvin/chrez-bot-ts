import { ServiceFileSupabase } from "@library";
import { isUser, User } from "@models";
import { supabase } from "@shared/supabase";

export class UserService {
    protected static readonly dbName = "users";

    public static service = new ServiceFileSupabase<User, "user_id">(
        supabase,
        "user_id",
        {
            tableName: UserService.dbName,
            typeGuard: isUser,
            useCache: true,
        }
    );

    public static async getUser(userid: User["user_id"]): Promise<User>{
        return await UserService.service.get(userid);
    }

    public static async findUser(usernameOrAlias: User["username"]): Promise<User>{
        const find = await UserService
            .service
            .queryBuilder(query => query
                .or(`username.ilike.%${usernameOrAlias}%,aliases.cs.{${usernameOrAlias}}`)
                .limit(1)
                .single()
            );

        if(Array.isArray(find))
            throw new Error("Invalid response from database");

        return find;
    }

    /**
     * find users having birthday on given month and day
     * 
     * this function is still using cache so make sure to refresh cache if needed
     */
    public static findBirthdayUsers(): User[]{
        // today in japanese timezone
        const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const birthdayUsers = UserService
            .service
            .cache
            .filter(user => {
                if(!user.birthday) return false;

                const bday = new Date(user.birthday);
                const bdayMonth = bday.getMonth() + 1;
                const bdayDay = bday.getDate();
                
                return bdayMonth === month && bdayDay === day;
            })

        return birthdayUsers;
    }

    public static async getAllUsers(){
        return await UserService.service.getAll();
    }

    public static async setUserRole(userid: User["user_id"], role: User["role"]){
        await UserService.service.update(userid, {role: role});
    }

    public static async deleteUser(userid: User["user_id"]){
        await UserService.service.delete(userid);
    }

    public static async createUser(user: User): Promise<User | undefined>{
        return await UserService.service.add(user);
    }

    public static async userIsAdmin(discordId: User["user_id"]): Promise<boolean>{
        try{
            const user = await UserService.service.get(discordId);
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
}