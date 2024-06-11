import { OutputData } from "@editorjs/editorjs";
import { atom } from "recoil";

interface Blog {
  id: number;
  title: string;
  content: string;
}

export const blogsAtom = atom<Blog[]>({
  key: "blogsAtom",
  default: [],
});

export const userBlogsAtom = atom({
  key: "userBlogsAtom",
  default: [],
});

interface topicType {
  id: number;
  name: string;
  mainTopicId: number;
}

export const userTopicsAtom = atom<topicType[]>({
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
