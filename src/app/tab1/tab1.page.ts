import { Component, OnInit } from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  images: any[] = [];

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.fetchImages();
  }

  fetchImages() {
    this.imageService.getImages().subscribe(
      data => {
        console.log(data); // Log the API response data
        this.images = data; // Directly assign the data assuming the response is an array of images
      },
      error => {
        console.error('Error fetching images:', error);
      }
    );
  }

  refreshImages() {
    this.fetchImages();
  }
}
