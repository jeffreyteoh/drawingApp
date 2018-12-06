import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DashboardPage } from "../dashboard/dashboard";
import { AuthProvider } from "../../providers/auth/auth";
import { LoginPage } from "../login/login";


/**
 * Generated class for the StartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }

  loginUserAnonymously() {
      this.authProvider.loginUserAnonymously().then((a)=> {
        // this.loading.dismiss().then(() => {
        this.navCtrl.setRoot(DashboardPage, {
          fromStart: true
        });
      });
  }

  gotoLogin() {
    this.navCtrl.push(LoginPage);
  }

  // gotoDrawing() {
  //   // this.navCtrl.set
  // }

}
