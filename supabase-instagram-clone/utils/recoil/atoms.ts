import { atom } from "recoil";

export const searchState = atom({
  key: "searchState",
  default: "",
});

export const selectedUserIdState = atom({
  key: "selectedUserIdState",
  default: "",
});

export const selectedUserIndex = atom({
  key: "selectedUserIndex",
  default: 0,
});
