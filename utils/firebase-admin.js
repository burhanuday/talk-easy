import * as admin from "firebase-admin";
import serviceAccount from "../firebaseServiceAccount.json";

if (!admin.apps.length)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "talk-easy-d2267.appspot.com",
  });

export const db = admin.firestore();
export const firestore = admin.firestore;
export const storage = admin.storage();
