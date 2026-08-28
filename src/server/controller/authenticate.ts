const debug = require("debug")("Server:authenticate");

import { Request, Response } from "express";
import { OAUTH2_REDIRECT_URL, OAUTH2_REDIRECT_URL_SERVER } from "@config";

import {client} from "@shared/DiscordClient";

/**
 * authenticate user through discord oauth2, returns session_key
 */
export async function authenticate_get(req: Request, res: Response){

}

/**
 * authenticate the user without needing a redirect to the browser, used only on postman testing
 */
export async function authenticate_server(req: Request, res: Response){

};