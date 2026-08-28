import { SUPABASE_URL, SUPABASE_KEY } from "@config";
import { createClient } from "@supabase/supabase-js";
import {Database} from "../database.types"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const supabasePublic = createClient<Database, "public">(SUPABASE_URL, SUPABASE_KEY, {
    db: {
        schema: "public"
    }
});

export const supabaseModels = createClient<Database, "app_models">(SUPABASE_URL, SUPABASE_KEY, {
    db: {
        schema: "app_models"
    }
});