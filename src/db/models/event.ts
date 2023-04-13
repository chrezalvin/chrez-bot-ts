import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config";

export interface EventModel{
    name: string,
    date: Date,
    description: string,
    repeat?: "yearly" | "monthly" | "weekly" | "daily";
}

export type EventModelOptionals = Optional<EventModel, "repeat">;

export const Event = sequelize.define<Model<EventModel, EventModelOptionals>>("event", {
  name: DataTypes.TEXT,
  date: DataTypes.DATE,
  description: DataTypes.TEXT,
  repeat: DataTypes.TEXT
});

export default Event;