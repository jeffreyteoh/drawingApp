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

@NgModule({
  declarations: [
    MyApp,
    DashboardPage,
    LoginPage,
    CanvasDraw
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    GooglePlus
  ]
})
export class AppModule {}
