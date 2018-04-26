import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ConsumeRecordWeekPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'consume-record-week'
})
@Component({
  selector: 'page-consume-record-week',
  templateUrl: 'consume-record-week.html',
})
export class ConsumeRecordWeekPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsumeRecordWeekPage');
  }

}
