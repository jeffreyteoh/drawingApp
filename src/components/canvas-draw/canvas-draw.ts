import { Component, ViewChild, Renderer } from '@angular/core';
import {Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import * as fb from 'firebase';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})

export class CanvasDraw {

  @ViewChild('myCanvas') canvas: any;
  @ViewChild('cpyBtn') cpyBtn:any;

  canvasElement: any;
  lastX: number;
  lastY: number;
  uid: any;
  img: any;
  availableImg: any;
  userDrawing: boolean = false;
  openCanvas: boolean= false;

  currentColour: string = '#000000';
  availableColours: any;

  brushSize: number = 10;

  //File
  drawingID: any;
  pixi: any = {
    currentX: undefined,
    currentY: undefined,
    lastX: undefined,
    lastY: undefined,
    color: this.currentColour,
    brushSize: this.brushSize
  };

  constructor(public platform: Platform,
              public renderer: Renderer,
              navParam: NavParams,
              public navCtrl: NavController,
              public socialSharing: SocialSharing,
              public alertCtrl: AlertController) {
    this.drawingID = navParam.get("drawingID");
    this.uid = navParam.get("uid");
    this.pixi.user = this.uid;
    this.userDrawing = false;
    this.availableColours = [
      '#000000',
      '#1abc9c',
      '#3498db',
      '#9b59b6',
      '#e67e22',
      '#e74c3c'
    ];
    this.availableImg = [
      "Blank",
      "Barn",
      "Chicken"
    ];
  }

  //image selection for tracing
  doRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Tracing Image');

    this.availableImg.forEach(img=> {
      alert.addInput({
        type: 'radio',
        label: img,
        value: img,
        checked: img === "Blank"
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log('Radio data:', data);
        //set image in canvas
        fb.database().ref("drawing/" + this.drawingID + "/image").set({name: data });
        this.placeImage(data);
      }
    });
    alert.present();
  }

  placeImage(data) {
    //return blank image
    if (data === "Blank" || !data) return new Promise((rs)=> { return rs()});
    return fb.storage().ref("tracing/" + data + ".gif").getDownloadURL().then(link=> {
      let p = new Promise((rs)=> {
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = (data) => {
          console.log(data);
          let ctx = this.canvasElement.getContext("2d");
          rs(ctx.drawImage(img,0,0, this.canvasElement.width, this.canvasElement.height));
        };
        img.src = link;
      });
      return p;
    });
  }

  ngOnInit() {
    // this.drawingID = this.guid();
    // console.log(this.guid());
    // .ref("drawing/" + this.drawingID);
    // console.log(this.db);
  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;

    this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
    this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');
    this.update();
  }

  changeColour(colour){
    this.currentColour = colour;
  }

  changeSize(size){
    this.brushSize = size;
  }

  handleStart(ev){
    console.log(ev);
    this.userDrawing = true;
    this.lastX = ev.touches ? ev.touches[0].pageX: ev.clientX;
    this.lastY = ev.touches ? ev.touches[0].pageY: ev.clientY;
  }

  handleMove(ev){
    if (!this.userDrawing) {return false;}
    let currentX = ev.touches ? ev.touches[0].pageX: ev.clientX;
    let currentY = ev.touches ? ev.touches[0].pageY: ev.clientY;
    this.pixi.currentX = currentX;
    this.pixi.currentY = currentY;
    this.pixi.lastX = this.lastX;
    this.pixi.lastY = this.lastY;
    this.pixi.color = this.currentColour;
    this.pixi.brushSize = this.brushSize;

    this.draw(this.pixi);
    fb.database().ref("drawing/" + this.drawingID + "/content").push(this.pixi);
    this.lastX = currentX;
    this.lastY = currentY;

  }

  convert2Img() {
    this.userDrawing= false;
    let b64 = this.canvasElement.toDataURL();
    b64 = b64.replace("data:image/png;base64,", '');
    fb.storage().ref("drawing/" + this.drawingID + ".png" ).delete()
      .catch(err=> {console.log(err)});
    fb.storage().ref("drawing/" + this.drawingID + ".png" ).putString(b64, "base64");
  }

  draw(pixi) {
    let ctx = this.canvasElement.getContext('2d');
    setTimeout(()=> {
      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.moveTo(pixi.lastX, pixi.lastY);
      ctx.lineTo(pixi.currentX, pixi.currentY);
      ctx.closePath();
      ctx.strokeStyle = pixi.color;
      ctx.lineWidth = pixi.brushSize;
      ctx.stroke();
    }, 0);
  }

  clearCanvas(){
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    return fb.database().ref("drawing/" + this.drawingID + "/content").set(null);
  }

  playDrawing() {
    console.log("playDrawing");
    let db = fb.database().ref("drawing/" + this.drawingID);
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    db.once("value").then((snap) => {
      let arr = [],
          obj = snap.val();
      console.log(obj.image.name);
      arr = Object.keys(obj.content).map(i => obj.content[i]);
      console.log(arr);
      if (obj.image.name === "blank" || !obj.image) {
          setTimeout(()=> {
            this.loopDrawing(arr);
          },0);
      }
      else {
        this.placeImage(obj.image.name).then(()=> {
          setTimeout(()=> {
            this.loopDrawing(arr);
          });
        });
      }
    })
  }

  loopDrawing(arr) {
    let ind = 1,
        i= 0;

    while (ind !== arr.length) {
      //clear canvas everyime for animation
      // ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      while (i !== ind) {
        this.draw(arr[i]);
        i++;
      }
      i = 0;
      ind++;
    }
  }

  update() {
    let canvas = this;
    let db = fb.database().ref("drawing/" + this.drawingID + "/content");
    let dbImg = fb.database().ref("drawing/" + this.drawingID + "/image");

    dbImg.on('child_changed',  snapshot=> {
      let name = snapshot.val()? snapshot.val().name: null;
      if (name !== "Blank" && name) {
        this.placeImage(name);
      }
    });
    dbImg.once('value').then(snapshot=> {
      let name = snapshot.val()? snapshot.val().name: null;
      if (name !== "Blank" && name) {
        this.placeImage(name).then(()=> {
          db.on('child_added', function (snapshot) { canvas.draw(snapshot.val()); });
        })
      } else { db.on('child_added', function (snapshot) { canvas.draw(snapshot.val()); });}
    });
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  goback() {
    return this.navCtrl.pop();
  }

  share() {
    if (this.platform.is('mobile')) {
      let msg = "Enter this id to draw with me : " + this.drawingID;
      this.socialSharing.share(msg, null, null,null);
    } else {
      this.presentAlert();
    }
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Copy and Share',
      subTitle: 'Share the drawing id to collaborate:',
      inputs: [{
          name: 'Drawing ID',
          value: this.drawingID,
      }],
      buttons: ['Done'],
    });

    alert.present();
  }
}
