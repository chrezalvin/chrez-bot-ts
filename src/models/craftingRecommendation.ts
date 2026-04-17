import {debug} from "debug";

const log = debug("models:CraftingRecommendation");

const gearTypes = [
    "one_handed_sword", 
    "two_handed_sword", 
    "staff", 
    "magic_device", 
    "bowgun", 
    "bow", 
    "katana", 
    "halberd", 
    "knuckles", 
    "armor", 
    "additional", 
    "special", 
    "dagger", 
    "arrow", 
    "shield"
] as const;

export type GearType = typeof gearTypes[number];

export interface CraftingRecommendation {
    crafting_id: number;
    equipment_name: string;
    item_level: number;
    difficulty: number;
    gear_type: GearType;
    cost_rating: number;
    is_boss: boolean;
}

function isGearType(value: unknown): value is GearType {
    return typeof value === "string" && gearTypes.includes(value as GearType);
}

export function isCraftingRecommendation(obj: unknown): obj is CraftingRecommendation {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }

    const keys = [
        "crafting_id",
        "equipment_name",
        "item_level",
        "difficulty",
        "gear_type",
        "cost_rating",
        "is_boss"
    ] as const;

    for (const key of keys) {
        if (!(key in obj)) {
            log(`property ${key} is not defined`);
            return false;
        }
    }

    const obj2 = obj as Record<keyof CraftingRecommendation, unknown>;

    if (typeof obj2.crafting_id !== "number") {
        log("property crafting_id is not a number");
        return false;
    }

    if (typeof obj2.equipment_name !== "string") {
        log("property equipment_name is not a string");
        return false;
    }

    if (typeof obj2.item_level !== "number") {
        log("property item_level is not a number");
        return false;
    }

    if (typeof obj2.difficulty !== "number") {
        log("property difficulty is not a number");
        return false;
    }

    if (!isGearType(obj2.gear_type)) {
        log("property gear_type is not a valid GearType");
        return false;
    }

    if (typeof obj2.cost_rating !== "number") {
        log("property cost_rating is not a number");
        return false;
    }

    if (typeof obj2.is_boss !== "boolean") {
        log("property is_boss is not a boolean");
        return false;
    }

    return true;
}