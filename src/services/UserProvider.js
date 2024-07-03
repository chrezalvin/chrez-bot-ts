class UserProvider{
    static async login(username, password){
        // check if username and password are string
        if(typeof username !== 'string' || typeof password !== 'string'){
            throw new Error('Username and password must be string!');
        }

        const data = await stmt.query("CALL login(?, ?)", [username, password]);

        return data;
    }
}