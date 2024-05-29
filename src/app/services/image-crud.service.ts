import { Injectable } from '@angular/core';
import { Storage, ref, uploadString, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, docData, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { Photo } from '../models/photo.interface';

@Injectable({
  providedIn: 'root'
})
export class ImageCrudService {
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

  async uploadImage(photo: Photo) {
    const user = this.auth.currentUser;
    const timestamp = Date.now();
    const path = `uploads/${user?.uid}/${timestamp}.png`;
    const storageRef = ref(this.storage, path);

    try {
      console.log('Uploading image to Firebase Storage...');
      await uploadString(storageRef, photo.base64 || '', 'base64');
      console.log('Image uploaded successfully');

      const imageUrl = await getDownloadURL(storageRef);
      console.log('Image download URL:', imageUrl);

      const userDocRef = doc(this.firestore, `users/${user?.uid}`);
      await updateDoc(userDocRef, {
        images: arrayUnion(imageUrl)
      });

      console.log('Image URL added to Firestore');
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async getImages() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user?.uid}`);
    const userDoc = await docData(userDocRef).toPromise();
    return userDoc?.images || [];
  }

  async deleteImage(imageUrl: string) {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user?.uid}`);

    try {
      // Delete image from Storage
      const storageRef = ref(this.storage, imageUrl);
      await deleteObject(storageRef);
      console.log('Image deleted from Storage');

      // Remove image URL from Firestore
      await updateDoc(userDocRef, {
        images: arrayRemove(imageUrl)
      });
      console.log('Image URL removed from Firestore');
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}