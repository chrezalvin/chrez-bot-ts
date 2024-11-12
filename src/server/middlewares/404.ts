import { RequestHandler } from "express";

export function page404(): RequestHandler{
    return (_, res) => {
        res.status(404).send("Page not found");
    }
}