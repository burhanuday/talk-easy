const { storage } = require("constants/Storage");

export const getUserId = () => localStorage.getItem(storage.userId);
export const setUserLanguage = (userLanguage) =>
  localStorage.setItem(storage.userLanguage, userLanguage);

export const getUserLanguage = () => localStorage.getItem(storage.userLanguage);
