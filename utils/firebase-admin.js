import * as admin from "firebase-admin";
import serviceAccount from "../firebaseServiceAccount.json";

if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

export const db = admin.firestore();
export const firestore = admin.firestore;
