import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  regForm: FormGroup | undefined; 

  constructor(public formBuilder:FormBuilder, public loadingCtrl:LoadingController, public authService: Auth) { }

  ngOnInit() {
    this,this.regForm = this.formBuilder.group({
      fullname:['',[Validators.required]],
      email:['',[Validators.required, Validators.email, Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"),]],
      password:['', Validators.required, Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")]
      
    })
  }
  get errorControl(){
    return this.regForm?.controls;
  }
  async singup(){
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if(this.regForm?.valid){
      const user = await this.authService.registerUser(email,password)
    }
  }
}
