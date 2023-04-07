import { Model, DataTypes } from "sequelize";
import sequelize from "../config";

interface EventModel{
    name: string
}

export const Event = sequelize.define<Model<EventModel>>("event", {
  name: DataTypes.TEXT
});

export default Event;