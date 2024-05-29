import { Injectable } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, docData } from '@angular/fire/firestore';
import { Photo } from '../models/photo.interface';
import { getDownloadURL, ref, uploadString } from '@firebase/storage';
import { setDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user?.uid}`);
    return docData(userDocRef);
  }

  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    const path = `uploads/${user?.uid}/profile.png`;
    const storageRef = ref(this.storage, path);

    try {
      console.log('Uploading image to Firebase Storage...');
      const uploadTask = uploadString(storageRef, cameraFile.base64, 'base64');

      uploadTask.then((snapshot) => {
        console.log('Image uploaded successfully:', snapshot);
        return getDownloadURL(storageRef);
      }).then((imageUrl) => {
        console.log('Image download URL:', imageUrl);
        const userDocRef = doc(this.firestore, `users/${user?.uid}`);
        return setDoc(userDocRef, { imageUrl });
      }).catch((error) => {
        console.error('Error uploading image:', error);
        throw error;
      });
    } catch (e) {
      console.error('Error in uploadImage:', e);
      return null;
    }
  }
}