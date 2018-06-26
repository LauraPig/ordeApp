import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SuperTabsController} from "ionic2-super-tabs";

/**
 * Generated class for the MessageRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-record',
  templateUrl: 'message-record.html',
})
export class MessageRecordPage {
  page1: any = "message-week";
  page2: any = "message-month";
  page3: any = "message-three-months";
  selectedTabIndex: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public superTabsCtrl: SuperTabsController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
  }

  // goHomeMenuPage() {
  //   this.navCtrl.push('homeMenu');
  // }
  //
  // goSettingPage() {
  //   this.navCtrl.push('setting');
  // }

}
