import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export const uploadFileToFirebase = async (file: Express.Multer.File): Promise<UploadResult> => {
  try {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${timestamp}-${originalName}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, fileName);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      fileUrl: downloadURL,
      fileName: originalName,
      fileType: file.mimetype,
      fileSize: file.size
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};