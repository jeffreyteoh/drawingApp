import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  Alert,
  AlertController,
  Loading,
  LoadingController
}  from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from "../../providers/auth/auth";
import { EmailValidator } from "../../validators/email";
import { DashboardPage } from "../dashboard/dashboard";


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    formBuilder: FormBuilder
  ) {
    this.loginForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.loginForm.value}`
      );
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authProvider.loginUser(email, password).then(
        authData => {
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(DashboardPage);
          });
        },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            alert.present();
          });
        }
      );
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  loginUserWithSocialMedia(media) {
    // @ts-ignore
    this.authProvider.loginUserWithSocialMedial(media).then(authData => {
      console.log("login",authData);
      this.navCtrl.setRoot(DashboardPage);
    });
    //   .catch(err=> {
    //   console.log(err);
    //   const alert: Alert = this.alertCtrl.create({
    //     message: err.message,
    //     buttons: [{ text: 'Ok', role: 'cancel' }]
    //   });
    //   alert.present();
    // });
  }

  loginUserAnonymously() {
    this.authProvider.loginUserAnonymously().then((a)=> {
      console.log(a);
      this.navCtrl.setRoot(DashboardPage);
    });
  }

  goToSignup():void {
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword():void {
    this.navCtrl.push('ResetPasswordPage');
  }


}
