import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ConsumeRecordThreeMonthsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'consume-record-three-months'
})
@Component({
  selector: 'page-consume-record-three-months',
  templateUrl: 'consume-record-three-months.html',
})
export class ConsumeRecordThreeMonthsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsumeRecordThreeMonthsPage');
  }

}
