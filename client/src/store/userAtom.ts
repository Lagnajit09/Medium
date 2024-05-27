import { atom } from "recoil";

export const blogsAtom = atom({
  key: "userPostsAtom",
  default: [],
});

export const userBlogsAtom = atom({
  key: "userPostsAtom",
  default: [],
});

export const userTopicsAtom = atom({
  key: "userTopicsAtom",
  default: [],
});

export const savedPostsAtom = atom({
  key: "savedPostsAtom",
  default: [],
});

