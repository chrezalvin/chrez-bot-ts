import { ServiceFileSupabase } from "@library";
import { isUser, User } from "@models";

export class UserService {
    protected static readonly dbName = "users_view";

    public static service = new ServiceFileSupabase<User, "id">("id",
        {
            tableName: UserService.dbName,
            typeGuard: isUser,
            useCache: true,
        }
    );

    public static async getUser(userid: string): Promise<User>{
        return await UserService.service.get(userid);
    }

    public static async findUser(usernameOrAlias: string): Promise<User>{
        const find = await UserService
            .service
            .queryBuilder(query => query
                .select("*")
                .or(`username.ilike.%${usernameOrAlias}%,aliases.cs.{${usernameOrAlias}}`)
                .limit(1)
                .single()
            );

        if(Array.isArray(find))
            throw new Error("Invalid response from database");

        return find;
    }

    public static async getAllUsers(){
        return await UserService.service.getAll();
    }

    public static async setUserRole(userid: string, role: User["role"]){
        await UserService.service.update(userid, {role: role});
    }

    public static async deleteUser(userid: string){
        await UserService.service.delete(userid);
    }

    public static async createUser(user: User): Promise<User | undefined>{
        return await UserService.service.add(user);
    }

    public static async userIsAdmin(discordId: string): Promise<boolean>{
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