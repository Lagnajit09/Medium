import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";


//Method to upload editorJS image in firebase storage.
export const uploadImageToFirebase = (file: File) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve({
              success: 1,
              file: {
                url: downloadURL,
              },
            });
          });
        }
      );
    });
  };


  //Method to delete an image from firebase if user deletes it on editorJS
  export const deleteImageFromFirebase = async (url: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, url);
  
    return deleteObject(imageRef).then(() => {
      console.log("File deleted successfully");
    }).catch((error) => {
      console.error("Error deleting file:", error);
    });
  };