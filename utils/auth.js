const { storage } = require("constants/Storage");

export const getUserId = () => localStorage.getItem(storage.userId);
