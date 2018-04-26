import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ConsumeRecordMonthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'consume-record-month'
})
@Component({
  selector: 'page-consume-record-month',
  templateUrl: 'consume-record-month.html',
})
export class ConsumeRecordMonthPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsumeRecordMonthPage');
  }

}
