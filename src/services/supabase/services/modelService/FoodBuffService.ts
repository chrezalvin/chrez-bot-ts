import { supabaseModels } from "@shared/supabase";
import { FoodBuff, foodBuffCreate, FoodBuffCreate, foodBuffUpdate, FoodBuffUpdate } from "../../types/models/FoodBuff";
import { FileUpload } from "@library";

export const tableName = "food_buffs";
export const bucketName = "foods";
export const fileUpload = new FileUpload(bucketName, supabaseModels);

async function getFoodBuff(food_buff: FoodBuff["food_buff"]): Promise<FoodBuff>{
    const {data} = await supabaseModels
        .from(tableName)
        .select()
        .eq("food_buff", food_buff)
        .single()
        .throwOnError();
        
    return data!;
}

export async function createFoodBuff(schema: FoodBuffCreate): Promise<FoodBuff>{
    const parsed = foodBuffCreate.parse(schema);

    let image: string | undefined = undefined;
    if(parsed.image)
        image = await fileUpload.uploadFile(parsed.image, {filename: parsed.foodBuff.food_buff});
    
    const {data} = await supabaseModels
        .from(tableName)
        .insert({
            ...parsed.foodBuff,
            image
        })
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateFoodBuff(
    food_buff: FoodBuff["food_buff"], 
    schema: FoodBuffUpdate, 
): Promise<FoodBuff>{
    const parsed = foodBuffUpdate.parse(schema);

    const get = await getFoodBuff(food_buff);

    let image: string | null | undefined = undefined;
    if(parsed.image !== undefined){
        if(get.image)
            await fileUpload.removeFile(get.image)

        image = parsed.image ? await fileUpload.uploadFile(parsed.image, {filename: get.food_buff}) : null;
    }

    const {data} = await supabaseModels
        .from(tableName)
        .update({
            ...parsed.foodBuff,
            image
        })
        .eq("food_buff", food_buff)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteFoodBuff(food_buff: FoodBuff["food_buff"]): Promise<true>{
    const get = await getFoodBuff(food_buff);

    if(get.image)
        fileUpload.removeFile(get.image);

    await supabaseModels
        .from(tableName)
        .delete()
        .eq("food_buff", food_buff)
        .throwOnError();

    return true;
}