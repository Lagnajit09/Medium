import ImageTool from '@editorjs/image';
import { deleteImageFromFirebase } from '../handlers/firebaseHandlers'; // Adjust the import path as needed

class CustomImageTool extends ImageTool {
  constructor({ data, config, api, readOnly }: any) {
    super({ data, config, api, readOnly });
    this.api = api;
    this.config = config;
    this.readOnly = readOnly;
  }

  render() {
    return super.render();
  }

  renderSettings() {
    const wrapper = document.createElement('div');

    const deleteButton = document.createElement('div');
    deleteButton.classList.add('ce-settings__button');
    deleteButton.innerHTML = `<span class="ce-settings__label">Click to delete</span>`;
    deleteButton.addEventListener('click', () => {
      const url = this.data.file.url;
      deleteImageFromFirebase(url).then(() => {
        this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex());
      }).catch((error: any) => {
        console.error("Error deleting image:", error);
      });
    });

    wrapper.appendChild(deleteButton);

    return wrapper;
  }

  save(blockContent: any) {
    const image = blockContent.querySelector('img');
    return {
      file: {
        url: image.src,
      },
      caption: blockContent.querySelector('[contenteditable]').innerHTML || '',
      withBorder: this.data.withBorder,
      stretched: this.data.stretched,
      withBackground: this.data.withBackground,
    };
  }

  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="17"><path d="M14.85 0H2.15C0.95 0 0 0.95 0 2.15v11.7C0 16.05 0.95 17 2.15 17h12.7c1.2 0 2.15-0.95 2.15-2.15V2.15C17 0.95 16.05 0 14.85 0zm1.3 13.85c0 0.7-0.55 1.25-1.25 1.25H2.15c-0.7 0-1.25-0.55-1.25-1.25V2.15c0-0.7 0.55-1.25 1.25-1.25h12.7c0.7 0 1.25 0.55 1.25 1.25v11.7z"/><path d="M12.5 5.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM4.3 12.7l2.85-3.6 2.15 2.7h5.5l-6-7.5L4.3 12.7z"/></svg>'
    };
  }
}

export default CustomImageTool;
