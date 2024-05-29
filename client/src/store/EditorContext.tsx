import React, { createContext, useContext, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

type EditorInstanceRef = React.MutableRefObject<EditorJS | null>;

const EditorContext = createContext<EditorInstanceRef>({ current: null });

export const useEditor = () => useContext(EditorContext);

export const EditorProvider: React.FC = ({ children }: any) => {
  const editorInstance = useRef<EditorJS | null>(null);

  return (
    <EditorContext.Provider value={editorInstance}>
      {children}
    </EditorContext.Provider>
  );
};
