import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SelectLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'select-location'
})
@Component({
  selector: 'page-select-location',
  templateUrl: 'select-location.html',
})
export class SelectLocationPage {
  location: string = '1002';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectLocationPage');
  }

  changeValue() {
    console.log(this.location);
  }

}
