import { Injectable } from '@angular/core';
import { Camera, CameraPhoto, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage } from '@capacitor/storage';
import { Filesystem, Directory, FilesystemDirectory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Photo } from '../models/photo.interface';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photos: Photo[] = [];
  private PHOTO_STORAGE = 'photos';
  constructor() { }
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    const saveImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(saveImageFile);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos.map(p=>{
        const photoCopy ={...p};
        delete photoCopy.base64;
        return photoCopy;
      }))
    });
  }
  public async loadSaved(){
    const photos = await Storage.get({
      key: this.PHOTO_STORAGE
    });
    this.photos = photos.value ? JSON.parse(photos.value) : [];
    for(let photo of this.photos){
      const readFile = await Filesystem.readFile({
        path: photo.filePath,
        directory: FilesystemDirectory.Data
      });
      photo.base64 = `data:image/jpeg;base64,${readFile.data}`
    }
  }
  public getPhotos():Photo[]{
    return this.photos;
  }
  private async savePicture(cameraPhoto: CameraPhoto){
    const base64Data = await this.readAsBase64(cameraPhoto);

    const fileName = new Date().getTime()+'.jpeg';
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });
    return await this.getPhotoFile(cameraPhoto, fileName);
  }
  private async getPhotoFile(cameraPhoto:CameraPhoto, fileName:string):Promise<Photo>{
    return{
      filePath: fileName,
      webviewPath: cameraPhoto.webPath
    }
  }

  private async readAsBase64(cameraPhoto: CameraPhoto){ 
    if(cameraPhoto.webPath){
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }else{
    return '';
  }
}
   convertBlobToBase64 =(blob:Blob)=>new Promise((resolve, reject)=>{
    const reader = new FileReader;
    reader.onerror=reject;
    reader.onload=()=>{
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
   });
}
