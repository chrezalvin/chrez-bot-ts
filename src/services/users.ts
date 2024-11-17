import { ServiceSupabase } from "@library";
import { isUser, User } from "@models";

export class UserService {
    protected static readonly dbName = "users_view";

    public static service = new ServiceSupabase<User, "id">("id", UserService.dbName, {
        typeGuard: isUser,
        useCache: true,
    });

    public static async getUser(userid: string): Promise<User>{
        const find = await UserService.service.get(userid);

        if(!find) 
            throw new Error("User not found");

        return find;
    }

    public static async findUser(usernameOrAlias: string): Promise<User>{
        const find = await UserService
            .service
            .queryBuilder(query => query
                .select("*")
                .or(`username.ilike.%${usernameOrAlias}%,aliases.cs.{${usernameOrAlias}}`)
                .single()
            );

        if(Array.isArray(find))
            throw new Error("Invalid response from database");

        return find;
    }

    public static async getAllUsers(){
        const find = await UserService.service.getAll();

        return find;
    }

    public static async setUserRole(userid: string, role: User["rolename"]){
        // find the user by id
        const user = await UserService.service.get(userid);

        if(!user)
            throw new Error("User not found");

        await UserService.service.update(userid, {...user, rolename: role});
    }

    public static async deleteUser(userid: string){
        await UserService.service.delete(userid);
    }

    // public static findUser(pred: (user: User) => boolean){
    //     return UserService.service.getWhere(pred);
    // }

    public static async createUser(user: User): Promise<User | undefined>{
        return await UserService.service.add(user);
    }

    public static async userIsAdmin(discordId: string): Promise<boolean>{
        try{
            const user = await UserService.service.get(discordId);
            if(!user) throw new Error("User not found");

            switch(user.rolename){
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