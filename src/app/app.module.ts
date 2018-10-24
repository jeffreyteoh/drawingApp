import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { DashboardPage} from "../pages/dashboard/dashboard";
import { LoginPage } from "../pages/login/login";
import { CanvasDraw } from '../components/canvas-draw/canvas-draw';
import { AuthProvider } from '../providers/auth/auth';
import { GooglePlus } from "@ionic-native/google-plus";
import { HomePage } from "../pages/home/home";
import { SocialSharing} from "@ionic-native/social-sharing";
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp,
    DashboardPage,
    LoginPage,
    CanvasDraw,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    LoginPage,
    HomePage,
    CanvasDraw
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    GooglePlus,
    SocialSharing
  ]
})
export class AppModule {}
