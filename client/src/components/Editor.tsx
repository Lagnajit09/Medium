import React, { useCallback, useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import { SERVER } from '../config';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { editorInstanceAtom } from '../store/userAtom';
import { loadingAtom } from '../store/loader';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

interface EditorProps {
  data?: OutputData | undefined;
  fetchedTitle: string;
}

const Editor = ({data, fetchedTitle}:EditorProps) => {
  const editorInstance = useRef<EditorJS>();
  const [title, setTitle] = useState(fetchedTitle);
  const setEditorAtom = useSetRecoilState(editorInstanceAtom);
  const loading = useRecoilValue(loadingAtom)
  const navigate = useNavigate()

  useEffect(() => {
    if (!editorInstance.current) {
      try {
        editorInstance.current = new EditorJS({
        holder: 'editorjs',
        placeholder: 'Let\'s write an awesome story!',
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+H',
            config: {
              placeholder: 'Title',
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+P',
            config: {
              placeholder: 'Write your story here...',
            },
          },
          image: {
            class: Image,
            shortcut: 'ALT+SHIFT',
            config: {
              uploader: {
                uploadByFile(file: File) {
                  return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      resolve({
                        success: 1,
                        file: {
                          url: reader.result as string,
                        },
                      });
                    };
                    reader.onerror = (error) => {
                      reject(error);
                    };
                    reader.readAsDataURL(file);
                  });
                },
                uploadByUrl(url: string) {
                  return new Promise((resolve) => {
                    resolve({
                      success: 1,
                      file: {
                        url: url,
                      },
                    });
                  });
                },
              },
            },
          },
          code: Code,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: `${SERVER}/api/v1/user/fetchurl`, // Your backend endpoint for url data fetching,
            }
          }
        },
        data: data,
        onChange: updateBtnText
        });
      } catch (error) {
        navigate('/home')
      }
      }
  
      return () => {
        try {
        editorInstance.current?.destroy();
        editorInstance.current = undefined;
        } catch (error) {
          console.log("first")
        }

      };
    }, []);

    useEffect(() => {
        setEditorAtom(() => saveEditorData);
    }, [setEditorAtom, title])


    const updateBtnText = () => {
      const saveBtn = document.getElementById("saveBlogButton");
        if(saveBtn)
          saveBtn.innerHTML = 'Save'
    }

    // useEffect(() => {
    //   document.getElementById('editorjs')?.addEventListener('change', updateBtnText)
    // }, [title, editorInstance])

    const saveEditorData = async () => {
      const data = await editorInstance?.current?.save();
      return {title, data};
    }

  return (
    <div className='w-[80%] mx-auto pt-10 overflow-hidden'>
        <textarea 
            placeholder='Title' 
            className='min-w-[50%] max-w-[80%] border-b-2 font-bold text-5xl p-1 outline-none text-gray-800 ml-[20%] resize-none scrollbar-hide' 
            onChange={
                (e) => {
                  setTitle(e.target.value); 
                  updateBtnText();
                }} 
          >{title}</textarea>
      <div id="editorjs" className=" my-4 p-4 text-gray-800"></div>
    </div>
  );
};

export default Editor;
