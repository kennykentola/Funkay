import { storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/**
 * Uploads an image binary file to Firebase Cloud Storage.
 * Returns the public HTTPS CDN download URL to be saved in Firestore.
 * 
 * @param file The image File object to upload
 * @param folder Target folder in Firebase Storage bucket ("equipment" | "gallery")
 * @param onProgress Optional progress callback returning percentage (0 - 100)
 */
export async function uploadImageToStorage(
  file: File,
  folder: "equipment" | "gallery" = "equipment",
  onProgress?: (progress: number) => void
): Promise<string> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${folder}/${Date.now()}_${sanitizedName}`;
  const storageRef = ref(storage, fileName);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error("Firebase Storage Upload Error:", error);
        reject(
          new Error(
            `Failed to upload image to Firebase Storage: ${error.message}`
          )
        );
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err: any) {
          reject(
            new Error(
              `Failed to retrieve download URL from Storage: ${err.message}`
            )
          );
        }
      }
    );
  });
}
