import { RequestHandler } from "express";

export function page404(): RequestHandler{
    return (req, res, next) => {
        res.status(404).send("Page not found");
    }
}