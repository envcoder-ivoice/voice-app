import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  authType : string = "login";

  constructor(public navCtrl: NavController) {

  }

}
