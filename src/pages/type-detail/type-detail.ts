import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TypeDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'type-detail'
})
@Component({
  selector: 'page-type-detail',
  templateUrl: 'type-detail.html',
})
export class TypeDetailPage {
  name: string;
  date: string;
  typeItem: object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.name = navParams.get('name');
    this.date = navParams.get('date');
    this.typeItem = navParams.get('typeItem');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TypeDetailPage');
  }

}
