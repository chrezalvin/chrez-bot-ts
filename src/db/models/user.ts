import { Optional, Model, DataTypes } from "sequelize";
import sequelize from "../config";

export interface UserModel{
    name: string,
    favoriteColor: string,
    age: number,
    cash: number
}

export type UserModelOptionals = Optional<UserModel, "favoriteColor" | "age" | "cash">

export const User = sequelize.define<Model<UserModel, UserModelOptionals>>("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: 'green'
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER 
});

export default User;