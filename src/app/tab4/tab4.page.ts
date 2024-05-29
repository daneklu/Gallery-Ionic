import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../authentication.service';
import { AvatarService } from '../services/avatar.service';
import { Photo } from '../models/photo.interface';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {
  user: any;
  profile = null;

  constructor(
    public route: Router,
    public authService: AuthenticationService,
    private avatarService: AvatarService,
    private loadinController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.authService.getProfike().then((user) => {
      this.user = user;
    });

    this.avatarService.getUserProfile().subscribe((data) => {
      this.profile = data;
    });
  }

  async logout() {
    try {
      await this.authService.singOut();
      this.route.navigate(['/landing']);
    } catch (error) {
      console.log(error);
    }
  }

  async changeImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      if (image) {
        const loading = await this.loadinController.create();
        await loading.present();

        const photo: Photo = {
          filePath: 'temp.png', // Provide a temporary file path
          base64: image.base64String || '',
        };

        const result = await this.avatarService.uploadImage(photo);
        await loading.dismiss();
      }
    } catch (error) {
      console.log(error);
    }
  }
}