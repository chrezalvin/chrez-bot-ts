import { Optional, Model, DataTypes } from "sequelize";
import sequelize from "../config";

interface UserModel{
    name: string,
    favoriteColor: string,
    age: number,
    cash: number
}

type Opt = Optional<UserModel, "favoriteColor" | "age" | "cash">

export const User = sequelize.define<Model<UserModel, Opt>>("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: 'green'
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER 
});

export default User;