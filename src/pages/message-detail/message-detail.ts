import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MessageDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'message-detail'
})
@Component({
  selector: 'page-message-detail',
  templateUrl: 'message-detail.html',
})
export class MessageDetailPage {
  item: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = this.navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessageDetailPage');
  }

}
