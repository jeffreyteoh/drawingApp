import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { DashboardPage } from "../dashboard/dashboard";
import { AuthProvider } from "../../providers/auth/auth";


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
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public loadingCtrl: LoadingController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }

  loginUserAnonymously() {
    this.authProvider.loginUserAnonymously().then((a)=> {
      console.log(a);
      // this.loading.dismiss().then(() => {
        this.navCtrl.setRoot(DashboardPage);
      // });
    });
  }

}
