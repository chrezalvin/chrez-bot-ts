import { BasicParameters } from "@library";

/**
 * CustomArgs interface for ChrezBot middleware
 */
export interface CustomArgs extends BasicParameters{
    args: string[];
}