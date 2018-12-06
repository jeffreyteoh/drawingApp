import { Component } from '@angular/core';
import { IonicPage,
  NavController,
  AlertController,
  LoadingController,
  Platform,
  NavParams
} from 'ionic-angular';
import * as firebase from 'firebase';
import { HomePage } from "../home/home";
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})

export class DashboardPage {
  private uid: any = firebase.auth().currentUser.uid;
  private drawingId: any;
  private drawingList: any = [];
  private fromStart: any;

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              public loadCtrl: LoadingController,
              public platform: Platform,
              public authProvider: AuthProvider,
              navParam: NavParams
  ) {
    this.loadCtrl.create();
    this.fromStart = navParam.get("fromStart");
    let dash = this;

    if (this.fromStart) {
      this.createNewDrawing();
    }
    // console.log(menu.getMenus());
    // this.menu._register()
    firebase.database().ref("user/" + this.uid + "/drawing").once("value")
      .then((snapshot) => {
        snapshot.forEach(childSnap => {
          console.log();
          let id = childSnap.val();
          firebase.storage().ref("drawing/" + id + ".png").getDownloadURL()
            .then(data =>{
              dash.drawingList.push({
                id: id,
                img: data,
                parent:this
              });
          }).catch(err=>{
            dash.drawingList.push({
              id: id,
              img: "assets/imgs/no_image.png",
              parent: this
            });
            console.log(err);
          });
        });
      });
  }


  newDrawing() {
    console.log(this.drawingId);
    this.drawingList = [this.drawingId, ...this.drawingList];
    this.updateUser(this.drawingId).then(() => {
      this.gotoCanvas(this.drawingId);
    });
  }

  gotoCanvas(id) {
    this.navCtrl.push(HomePage, {
      drawingID: id,
      uid: this.uid,
      parent: this
    });
  }

  updateUser(drawingID) {
    return firebase.database().ref("user/" + this.uid + "/drawing").push(drawingID)
      .then(function (snapshot) {
      console.info("User drawing updated", snapshot);
      }, function (err) {
        // console.log(err);
      });
  }

  presentPrompt() {
    let db = firebase.database().ref("drawing");
    let dashboard = this;
    let alert = this.alertCtrl.create({
        title: "Let's Draw Together",
        inputs: [
          {
            name: 'drawingID',
            placeholder: 'Leave it blank if no drawing id'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Go',
            handler: data => {
              console.log(data);
              if (data.drawingID) {
                db.child(data.drawingID).once('value').then(snapshot => {
                  if (snapshot.val()) {
                    dashboard.drawingId = data.drawingID;
                    dashboard.newDrawing();
                  }
                });
              }
              else { dashboard.createNewDrawing(); }
            }
          }
        ]
      });
    alert.present();
  }

  createNewDrawing() {
    let db = firebase.database().ref("drawing");
    let dashboard = this;
    return db.push({user: [this.uid]}).then(function (snapshot) {
      dashboard.drawingId = snapshot.key;
      dashboard.newDrawing();
      return snapshot.key;
    });
  }

  logoutUser() {
    this.authProvider.logoutUser().then(function () {
      console.log("logout successfully");
      window.location.reload();
    })
  }
}
