export interface Die{
    id: number;
    message: string;
    role: number;
}

export function isDie(value: unknown): value is Die {
    if(typeof value !== "object" || value === null)
        return false;

    if(!("id" in value) || typeof value.id !== "number")
        return false;

    if(!("message" in value) || typeof value.message !== "string")
        return false;

    if(!("role" in value) || typeof value.role !== "number")
        return false;

    return true;
}

export default Die;