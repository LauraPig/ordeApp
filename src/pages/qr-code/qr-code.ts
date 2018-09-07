import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import {Storage} from "@ionic/storage";
/**
 * Generated class for the QrCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'qr-code'
})
@Component({
  selector: 'page-qr-code',
  templateUrl: 'qr-code.html',
})
export class QrCodePage {
  todayStr: string;
  userNo: string;
  qrCodeStr: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
  ) {
    this.storage.get('userCode').then(res =>{
      if (res) {
        this.userNo = res;
        let timestampStr = moment().format('x');
        this.qrCodeStr = `esquel,${this.userNo},${timestampStr}`;
      }
    });

  }

  ionViewDidLoad() {
    this.todayStr = moment().format('YYYY-MM-DD');
    console.log('ionViewDidLoad QrCodePage');
  }

  ionViewWillEnter() {
    this.storage.get('userCode').then(res =>{
      if (!res) {
        this.userNo = res;
        let timestampStr = moment().format('x');
        this.qrCodeStr = `esquel,${this.userNo},${timestampStr}`;
      }
    });
  }

  refreshQRcode() {
    let timestampStr = moment().format('x');
    this.qrCodeStr = `esquel,${this.userNo},${timestampStr}`;
  }

}
