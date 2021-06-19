const { storage } = require("constants/Storage");

export const getUserId = () => localStorage.getItem(storage.userId);

export const setUserLanguage = (userLanguage) =>
  localStorage.setItem(storage.userLanguage, userLanguage);

export const getUserLanguage = () => localStorage.getItem(storage.userLanguage);

export const setMeetingDetails = (details) =>
  localStorage.setItem(storage.meetingDetails, JSON.stringify(details));
export const getMeetingDetails = () => JSON.parse(localStorage.getItem(storage.meetingDetails));
