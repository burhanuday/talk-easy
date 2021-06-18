import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { firebaseConfig } from "constants/firebase";
import { storage } from "constants/Storage";

export const firebaseInit = () => {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
};

export const signInAnonymously = async () => {
  try {
    const uid = localStorage.getItem(storage.userId);
    if (uid) return uid;

    const { user } = await firebase.auth().signInAnonymously();
    localStorage.setItem(storage.userId, user.uid);
    return user.uid;
  } catch (e) {
    console.error("SIGN_IN_ERROR::", e);
  }
};
