import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular'; // Import NavController
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    private navCtrl: NavController // Inject NavController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")]]
    });
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  async login() {
    console.log('Login method triggered');

    const loading = await this.loadingCtrl.create();
    await loading.present();

    console.log('Form Valid:', this.loginForm.valid);
    console.log('Form Values:', this.loginForm.value);

    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      try {
        const user = await this.authService.loginUser(email, password);
        console.log('User logged in:', user);

        if (user) {
          await loading.dismiss();
          this.navCtrl.navigateRoot('/tab1'); // Use navigateRoot for root-level navigation
        } else {
          // Handle invalid credentials (e.g., display error message)
          console.error('Invalid credentials');
          await loading.dismiss();
        }
      } catch (error) {
        console.error('Error logging in:', error);
        await loading.dismiss();
      }
    } else {
      console.log('Form is invalid'); // Debugging
      await loading.dismiss();
    }
  }
}
