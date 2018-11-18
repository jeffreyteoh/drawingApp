import { Injectable } from '@angular/core';
import { Platform } from "ionic-angular";
import * as firebase from "firebase";
import { GooglePlus } from "@ionic-native/google-plus";


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  private device: boolean;
  private googlePlus: any;

  constructor(platform: Platform, googlePlus: GooglePlus) {
    this.googlePlus = googlePlus;
    this.device = platform.is('mobile');
    console.log('Hello AuthProvider Provider');
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  loginUserWithSocialMedial(media) {
    let provider;
    console.log(media);
    switch (media) {
      case 'google': provider = new firebase.auth.GoogleAuthProvider(); break;
      case 'fb': provider = new firebase.auth.FacebookAuthProvider(); break;
      case 'twitter': provider = new firebase.auth.TwitterAuthProvider(); break;
    }
    console.log(provider);
    return this.oauthSignIn(provider);
  }

  loginUserAnonymously() {
    return firebase.auth().signInAnonymouslyAndRetrieveData().then((snap)=> {
      console.log(snap);
    });
  }

  private oauthSignIn(provider) {
    if (this.device) {
        this.googlePlus.login({
          'offline': true,
          'webClientId': '430331119499-9eb43lmjtfmvur08gh678fl3656rmvap.apps.googleusercontent.com'
        }).then( res => {
          console.log("res", res);
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);

          firebase.auth().signInWithCredential(googleCredential)
            .then( response => {
              console.log("Firebase success: " + JSON.stringify(response));
            });
        }, err => {
          console.error("Error: ", err);
        });
        return false;
    }

    if (!(<any>window).cordova) {
      return firebase.auth().signInWithPopup(provider);
    } else {
      return firebase.auth().signInWithRedirect(provider)
        .then(() => {
          return firebase.auth().getRedirectResult().then( result => {
            // This gives you a Google Access Token.
            // You can use it to access the Google API.      L76:    this.authProvider.loginUserWithSocialMedial(media).then(authData => {
            // let token = result.credential.accessToken;
            // The signed-in user info.
            console.log(result);
            let user = result.user;
            console.log(user);
            // console.log(token, user);
            return user;
          }).catch(function(error) {
            // Handle Errors here.
            alert(error.message);
          });
        });
    }
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUserCredential => {
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/email`)
          .set(email);
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  resetPassword(email:string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }


  logoutUser(): Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/userProfile/${userId}`)
      .off();
    return firebase.auth().signOut();
  }


}
