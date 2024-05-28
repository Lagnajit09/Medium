import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';import { SERVER } from '../config';
;

const Editor: React.FC = () => {
  const editorInstance = useRef<EditorJS>();

  useEffect(() => {
    if (!editorInstance.current) {
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
      });
    }

    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = undefined;
    };
  }, []);

  const handleSave = async () => {
    const savedData = await editorInstance.current?.save();
    console.log('Saved data:', savedData);
    // You can send savedData to your server here
  };

  return (
    <div className='w-[80%] mx-auto pt-10 overflow-hidden'>
        <textarea placeholder='Title' className='min-w-[50%] max-w-[80%] border-b-2 font-bold text-5xl p-1 outline-none text-gray-800 ml-[20%] resize-none scrollbar-hide' />
      <div id="editorjs" className=" my-4 p-4 text-gray-800"></div>
    </div>
  );
};

export default Editor;
