import {debug} from "debug";

const log = debug("models:LevellingRecommendation");

export type MobType = "monster" | "boss" | "mini_boss";
export type MobElement = "fire" | "earth" | "water" | "wind" | "light" | "dark" | "neutral";

export interface LevellingRecommendation {
    mob_id: number;
    mob_name: string;
    mob_level: number;
    mob_base_exp: number | null;
    mob_location: string;
    mob_type: MobType;
    mob_element: MobElement;
    event: number | null;
    is_recommended: boolean;
    is_best_with_party: boolean;
    is_mq_locked: boolean;
    mob_image: string | null;
    note: string | null;
}

function isMobType(value: unknown): value is MobType {
    return value === "monster" || value === "boss" || value === "mini_boss";
}

function isMobElement(value: unknown): value is MobElement {
    return [
        "fire",
        "earth",
        "water",
        "wind",
        "light",
        "dark",
        "neutral"
    ].includes(value as string);
}

export function isLevellingRecommendation(obj: unknown): obj is LevellingRecommendation {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }

    const keys = [
        "mob_id",
        "mob_name",
        "mob_level",
        "mob_base_exp",
        "mob_location",
        "mob_type",
        "mob_image",
        "mob_element",
        "note",
        "event",
        "is_recommended",
        "is_best_with_party",
        "is_mq_locked",
    ] as const;

    for(const key of keys){
        if(!(key in obj)){
            log(`property ${key} is not defined`);
            return false;
        }
    }
    
    const obj2 = obj as Record<keyof LevellingRecommendation, unknown>;

    if (typeof obj2.mob_id !== "number") {
        log("property mob_id is not a number");
        return false;
    }

    if (typeof obj2.mob_name !== "string") {
        log("property mob_name is not a string");
        return false;
    }

    if (typeof obj2.mob_level !== "number") {
        log("property mob_level is not a number");
        return false;
    }

    if (typeof obj2.mob_base_exp !== "number" && obj2.mob_base_exp !== null) {
        log("property mob_base_exp is not a number or null");
        return false;
    }

    if (typeof obj2.mob_location !== "string") {
        log("property mob_location is not a string");
        return false;
    }

    if (!isMobType(obj2.mob_type)) {
        log("property mob_type is not a valid MobType");
        return false;
    }

    if (typeof obj2.is_recommended !== "boolean") {
        log("property is_recommended is not a boolean");
        return false;
    }

    if (typeof obj2.is_best_with_party !== "boolean") {
        log("property is_best_with_party is not a boolean");
        return false;
    }

    if (typeof obj2.is_mq_locked !== "boolean") {
        log("property is_mq_locked is not a boolean");
        return false;
    }

    if (typeof obj2.mob_image !== "string" && obj2.mob_image !== null) {
        log("property mob_image is not a string or null");
        return false;
    }

    if (typeof obj2.note !== "string" && obj2.note !== null) {
        log("property note is not a string or null");
        return false;
    }

    if (!isMobElement(obj2.mob_element)) {
        log("property element is not a valid MobElement");
        return false;
    }

    if (typeof obj2.event !== "number" && obj2.event !== null) {
        log("property event is not a number or null");
        return false;
    }

    return true;
}