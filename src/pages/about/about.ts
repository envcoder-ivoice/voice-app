import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public texting: string;
  public messages: any[];


  constructor(public navCtrl: NavController, public zone: NgZone) {
    this.texting = '';
    this.messages = [];

  }
  send(msg){
    var username = "App";
    var result = { user: 'App', text: msg};
  this.messages.push(result);
  }

}
