import firebase from "firebase/app";
import "firebase/firestore";

/**
 * Set a real time listener to change in messages of meeting
 * @param {string} meetingId meeting id to listen message changes of
 * @param {Function} cb callback on snapshot change
 * @returns function to unsubscribe to changes
 */
export const listenToMessageChanges = async (meetingId, cb) => {
  const db = firebase.firestore();

  return db
    .collection("meetings")
    .doc(meetingId)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .onSnapshot((docs) => cb(docs));
};

/**
 * real time listener to listen to changes in meeting doc
 * @param {string} meetingId meeting id
 * @param {Function} cb cb fired when change occurs
 * @returns function to unsub from changes
 */
export const listenToMeetingChanges = async (meetingId, cb) => {
  const db = firebase.firestore();

  return db
    .collection("meetings")
    .doc(meetingId)
    .onSnapshot((snapshot) => cb(snapshot));
};
