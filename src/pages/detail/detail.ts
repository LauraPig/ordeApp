import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'detail'
})
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  item: object = {};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = this.navParams.get('item');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
