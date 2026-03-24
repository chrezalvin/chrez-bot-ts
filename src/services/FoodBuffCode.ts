import { FoodBuffCode, isFoodBuffCode } from "@models/FoodBuffCode";
import { supabase } from "@shared/supabase";

const tableName = "food_buff_codes";

export async function getFoodBuffCodes(foodBuffType: FoodBuffCode["food_buff"]): Promise<FoodBuffCode[]> {
    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("food_buff", foodBuffType)
        .order("level", { ascending: true });

    if (error)
        throw error;

    if (!data)
        throw new Error("Failed to fetch food buff codes");

    for (const item of data)
        if (!isFoodBuffCode(item))
            throw new Error("Invalid food buff code data");

    return data;
}

export async function getFoodBuffCodesFromTypes(foodBuffTypes: FoodBuffCode["food_buff"][]): Promise<FoodBuffCode[]> {
    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .in("food_buff", foodBuffTypes)
        .order("level", { ascending: true });

    if (error)
        throw error;

    if (!data)
        throw new Error("Failed to fetch food buff codes");

    for (const item of data)
        if (!isFoodBuffCode(item))
            throw new Error("Invalid food buff code data");

    return data;
}

export async function getGuildFoodBuffCodes(): Promise<FoodBuffCode[]> {
    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("is_guild", true)
        .order("food_buff", { ascending: true })
        .order("level", { ascending: true });

    if (error)
        throw error;

    if (!data)
        throw new Error("Failed to fetch guild food buff codes");

    for (const item of data)
        if (!isFoodBuffCode(item))
            throw new Error("Invalid food buff code data");

    return data;
}