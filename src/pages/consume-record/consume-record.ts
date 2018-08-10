import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuperTabsController } from "ionic2-super-tabs/dist/index";
import { Storage } from '@ionic/storage';
import {CommonHelper} from "../../providers/common-helper";

/**
 * Generated class for the ConsumeRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-consume-record',
  templateUrl: 'consume-record.html',
})
export class ConsumeRecordPage {
  page1: any = "consume-record-week";
  page2: any = "consume-record-month";
  page3: any = "consume-record-three-months";
  selectedTabIndex: number = 0;
  messageCount: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public commonHelper: CommonHelper,
    public superTabsCtrl: SuperTabsController,
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsumeRecordPage');
  }

  ionViewWillEnter() {
    this.storage.get('messageCount').then(res =>{
      if (res) {
        this.messageCount = res;
      }
    });
  }

  gotoUnreadMessage() {
    this.navCtrl.push('unread-message');
  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }

  goSettingPage() {
    this.navCtrl.push('setting');
  }

  gotoHomePage() {
    this.commonHelper.GoBackHomePage();
  }

}
