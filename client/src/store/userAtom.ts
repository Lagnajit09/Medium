import { OutputData } from "@editorjs/editorjs";
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



interface SaveEditorDataResult {
  title: string;
  data: OutputData | undefined;
}

export const editorInstanceAtom = atom<() => Promise<SaveEditorDataResult | undefined>>({
  key: 'editorInstanceAtom',
  default: async () => {
    return undefined;
  },
});
