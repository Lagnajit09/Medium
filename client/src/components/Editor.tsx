import { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import { SERVER } from '../config';
import { useSetRecoilState } from 'recoil';
import { editorInstanceAtom } from '../store/userAtom';
import { useNavigate } from 'react-router-dom';

interface EditorProps {
  data?: OutputData | undefined;
  fetchedTitle: string;
  read?:boolean;
}

const Editor = ({data, fetchedTitle, read}:EditorProps) => {
  const editorInstance = useRef<EditorJS>();
  const [title, setTitle] = useState(fetchedTitle);
  const setEditorAtom = useSetRecoilState(editorInstanceAtom);
  const navigate = useNavigate();
  

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
          code: {
            class: Code,
            config: {
            }
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: `${SERVER}/api/v1/user/fetchurl`, // Your backend endpoint for url data fetching,
            }
          }
        },
        data: data,
        readOnly: read,
        onChange: () => {updateBtnText()}
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
    <div className='w-[90%] md:w-[80%] mx-auto pt-10 overflow-hidden'>
        <textarea 
            placeholder='Title' 
            className='min-w-[60%] max-w-[90%] md:max-w-[80%] border-b-2 font-bold text-5xl p-1 outline-none text-gray-800 ml-[3%] md:ml-[20%] resize-none scrollbar-hide bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-900' 
            onChange={
                (e) => {
                  setTitle(e.target.value); 
                  updateBtnText();
                }} 
                maxLength={50}
            disabled={read}
          >{title}</textarea>
      <div id="editorjs" className=" my-4 p-4 text-gray-800 dark:text-gray-200"></div>
    </div>
  );
};

export default Editor;
