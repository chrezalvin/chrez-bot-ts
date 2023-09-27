import { Model, DataTypes, Optional, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../config";

export interface EventModel{
    id: number,
    maker_id: string,
    name: string,
    date: Date,
    description: string,
    repeat?: "yearly" | "monthly" | "weekly" | "daily";
}

export type EventModelOptionals = Optional<EventModel, "repeat">;
export type EventModelRequired = Required<EventModel>;

class Ev extends Model<EventModelRequired, EventModelOptionals>{
  declare id: number;
  declare maker_id: string;
  declare name: string;
  declare date: Date;
  declare description: string;
  declare repeat: CreationOptional<"yearly" | "monthly" | "weekly" | "daily">;
}

export const Event = sequelize.define<Model<EventModel, EventModelOptionals>>("event", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  maker_id: DataTypes.STRING,
  name: DataTypes.TEXT,
  date: DataTypes.DATE,
  description: DataTypes.TEXT,
  repeat: DataTypes.TEXT,
});

export async function addEvent(
  maker_id: string,
  name: string, 
  date: Date, 
  description: string, 
  isRepeat?: "yearly" | "monthly" | "weekly" | "daily"
  ): Promise<boolean>
  {
    const now = new Date();
    if(now > date)
      throw new Error("The date of event is already expired");

    const data = await Event.create({
      id: 0,
      maker_id: maker_id,
      date: date,
      name: name,
      description: description,
      repeat: isRepeat
    });

  return true;
}

export async function deleteEvent(id: string): Promise<boolean>
  {

  return true;
}

export default Event;