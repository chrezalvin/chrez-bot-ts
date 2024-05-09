import { I_User } from "@services";
import * as express from "express";

declare global{
  namespace Express {
    interface Request {
      user?: I_User; 
    }
  }
}