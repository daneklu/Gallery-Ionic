import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Photo } from '../models/photo.interface'; 
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public photos: Photo[] = []; 
  constructor(public photoService: PhotoService) {
 
  }

  ngOnInit(){
    this.photoService.loadSaved().then(()=>{
      this.photos = this.photoService.getPhotos();
    })
  }
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
