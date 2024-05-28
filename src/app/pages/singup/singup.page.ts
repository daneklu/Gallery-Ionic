import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  regForm: FormGroup | undefined; 

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router
  ) {}

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$")]],
      password: ['', [Validators.required, Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")]]
    });
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async singup() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.regForm?.valid) {
      const email = this.regForm.value.email;
      const password = this.regForm.value.password;

      try {
        const user = await this.authService.resgisterUser(email, password);
        console.log('User registered:', user);
        loading.dismiss();
        if (user) {
          this.router.navigate(['/tab1']);
        } else {
          console.log("Provide a valid username and password");
        }
      } catch (error) {
        console.error('Error registering user:', error);
        loading.dismiss();
      }
    } else {
      await loading.dismiss();
    }
  }
}
