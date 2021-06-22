import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { firebaseConfig } from "constants/firebase";

export const firebaseInit = () => {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
};
