import { storage } from "constants/Storage";

export const setUserLanguage = (userLanguage) => {
  localStorage.setItem(storage.userLanguage, userLanguage);
};

export const getUserLanguage = () => {
  return localStorage.getItem(storage.userLanguage);
};
