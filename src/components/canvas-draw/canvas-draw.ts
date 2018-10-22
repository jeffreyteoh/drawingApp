import { Component, ViewChild, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';
import * as fb from 'firebase';

@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDraw {

  @ViewChild('myCanvas') canvas: any;

  canvasElement: any;
  lastX: number;
  lastY: number;

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
    brushSize: this.brushSize,
    user: "testing1"
  };

  constructor(public platform: Platform, public renderer: Renderer) {
    console.log('Hello CanvasDraw Component');
    this.drawingID = "60ccb569-1b27-17d0-f756-eeba128825a4";
    this.availableColours = [
      '#1abc9c',
      '#3498db',
      '#9b59b6',
      '#e67e22',
      '#e74c3c'
    ];
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
    this.lastX = ev.touches[0].pageX;
    this.lastY = ev.touches[0].pageY;
  }

  handleMove(ev){
    let currentX = ev.touches[0].pageX;
    let currentY = ev.touches[0].pageY;
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

  draw(pixi) {
    let ctx = this.canvasElement.getContext('2d');
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(pixi.lastX, pixi.lastY);
    ctx.lineTo(pixi.currentX, pixi.currentY);
    ctx.closePath();
    ctx.strokeStyle = pixi.color;
    ctx.lineWidth = pixi.brushSize;
    ctx.stroke();
  }

  clearCanvas(){
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    return fb.database().ref("drawing/" + this.drawingID + "/content").set(null);
  }

  update() {
    let canvas = this;
    let db = fb.database().ref("drawing/" + this.drawingID + "/content");

    db.on('child_added', function (snapshot) { canvas.draw(snapshot.val()); });
    db.on('child_removed', function (snapshot) { canvas.clearCanvas(); });
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

}
