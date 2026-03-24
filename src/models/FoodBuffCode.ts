import {debug} from "debug";

const log = debug("models:FoodBuffCode");

type FoodBuffType = 
    "max_mp" | 
    "max_hp" | 
    "ampr" | 
    "critical_rate" | 
    "matk" |
    "atk" | 
    "weapon_atk" | 
    "str" | 
    "dex" | 
    "int" | 
    "agi" | 
    "vit" | 
    "accuracy" | 
    "+aggro" | 
    "-aggro" | 
    "damage_to_neutral" | 
    "damage_to_dark" | 
    "damage_to_light" | 
    "damage_to_fire" | 
    "damage_to_earth" | 
    "damage_to_wind" | 
    "damage_to_water" | 
    "physical_resistance" | 
    "magical_resistance";
    
export interface FoodBuffCode {
    player_name: string;
    food_buff: FoodBuffType;
    code: string;
    level: number;
    updated_at: string;
    is_guild: boolean;
}

export const foodBuffTypes: FoodBuffType[] = [
    "max_mp", 
    "max_hp",
    "ampr",
    "critical_rate",
    "matk",
    "atk",
    "weapon_atk",
    "str",
    "dex",
    "int",
    "agi",
    "vit",
    "accuracy",
    "+aggro",
    "-aggro",
    "damage_to_neutral",
    "damage_to_dark",
    "damage_to_light",
    "damage_to_fire",
    "damage_to_earth",
    "damage_to_wind",
    "damage_to_water",
    "physical_resistance",
    "magical_resistance"
];

function isFoodBuffType(value: string): value is FoodBuffType {
    return foodBuffTypes.includes(value as FoodBuffType);
}

export function isFoodBuffCode(obj: unknown): obj is FoodBuffCode {
    if (typeof obj !== "object" || obj === null) {
        log("object is not defined or null");
        return false;
    }

    if (!("player_name" in obj)) {
        log("property player_name is not defined");
        return false;
    }

    if (!("food_buff" in obj)) {
        log("property food_buff is not defined");
        return false;
    }

    if (!("code" in obj)) {
        log("property code is not defined");
        return false;
    }

    if (!("level" in obj)) {
        log("property level is not defined");
        return false;
    }

    if (!("updated_at" in obj)) {
        log("property updated_at is not defined");
        return false;
    }

    if (!("is_guild" in obj)) {
        log("property is_guild is not defined");
        return false;
    }

    if (typeof obj.player_name !== "string") {
        log("property player_name is not a string");
        return false;
    }

    if (typeof obj.food_buff !== "string" || !isFoodBuffType(obj.food_buff)) {
        log("property food_buff is not a valid FoodBuffType");
        return false;
    }

    if (typeof obj.code !== "string") {
        log("property code is not a string");
        return false;
    }

    if (typeof obj.level !== "number") {
        log("property level is not a number");
        return false;
    }

    if (typeof obj.updated_at !== "string") {
        log("property updated_at is not a string");
        return false;
    }

    if (typeof obj.is_guild !== "boolean") {
        log("property is_guild is not a boolean");
        return false;
    }

    return true;
}