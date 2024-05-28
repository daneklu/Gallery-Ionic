import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
 selector: 'app-tab4',
 templateUrl: 'tab4.page.html',
 styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
 user: any;

 constructor(
   public route: Router,
   public authService: AuthenticationService
 ) {
   this.user = authService.getProfike();
 }

 async logout() {
   try {
     await this.authService.singOut();
     this.route.navigate(['/landing']);
   } catch (error) {
     console.log(error);
   }
 }
}