import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import {AngularFireAuth} from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  [x: string]: any;

  constructor(public ngFireAuth: AngularFireAuth) { }

  async resgisterUser(email:string, password:string){
    return await this.ngFireAuth.createUserWithEmailAndPassword(email, password)
  }
  async loginUser(email:string,password:string){
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }
  async resetPassword(email:string){
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }
  async singOut(){
    return await this.ngFireAuth.signOut()
  }
  async getProfike(){
    return await this.ngFireAuth.currentUser
  }
}
