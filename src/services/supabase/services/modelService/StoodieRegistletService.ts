import { supabaseModels } from "@shared/supabase";
import { StoodieRegistlet, StoodieRegistletCreate } from "../../types/models/StoodieRegistlet";

export const tableName = "stoodie_registlets";


export async function createStoodieRegistlet(schema: StoodieRegistletCreate): Promise<StoodieRegistlet[]>;
export async function createStoodieRegistlet(schema: StoodieRegistletCreate[]): Promise<StoodieRegistlet[]>;
export async function createStoodieRegistlet(schema: StoodieRegistletCreate | StoodieRegistletCreate[]): Promise<StoodieRegistlet[]>{
    const schemas: StoodieRegistletCreate[] = Array.isArray(schema) ? schema : [schema];

    const {data} = await supabaseModels
        .from(tableName)
        .insert(schemas)
        .select();

    return data!;
}

export async function deleteStoodieRegistlet(
    stoodieRegistlet: StoodieRegistlet
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("stoodie", stoodieRegistlet.stoodie)
        .eq("registlet", stoodieRegistlet.registlet)
        .throwOnError();

    return true;
}