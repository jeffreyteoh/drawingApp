import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FIREBASE_CONFIG } from './firebase.config';

import firebase from 'firebase/app';

import { LoginPage } from "../pages/login/login";
import {DashboardPage} from "../pages/dashboard/dashboard";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
      platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
        firebase.initializeApp(FIREBASE_CONFIG);
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          console.log(user);
          if (!user) {
            this.rootPage = LoginPage;
            unsubscribe();
          } else {
            this.rootPage = DashboardPage;
            unsubscribe();
          }
        });
    });
  }

}

