import { Router } from "express";

import { firestore } from "@config";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const router = Router();

router.get("/users", async (_, res) => {
    // get all users
    // const users = await firestore.collection("users").get();
});