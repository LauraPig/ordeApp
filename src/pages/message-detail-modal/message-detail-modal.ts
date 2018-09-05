import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import *  as moment from 'moment';

/**
 * Generated class for the MessageDetailModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'message-detail-modal'
})
@Component({
  selector: 'page-message-detail-modal',
  templateUrl: 'message-detail-modal.html',
})
export class MessageDetailModalPage {

  item: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public viewCtrl: ViewController,
    public httpDataPro: HttpDataProviders,
  ) {
    this.item = this.navParams.get('item');
  }

  ionViewDidLoad() {
    // alert('ionViewWillLeave');
    let reqDateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    // this.storage.get('token').then(res =>{
    //   if (res) {
    //     this.token = res;
    //   }
    // });
    let params = {
      'pushDate': reqDateStr,
      'flag': '0'
    };
    this.httpDataPro.fetchHasMessage(params).then (res => {
      // alert('res-in-loop->' + JSON.stringify(res));
      if (res.success) {
        this.storage.set('messageCount', res.body.count);
      } else if (res.errorCode === '-2') {
        alert('登录信息过期，请重新登录');
        this.storage.remove('token').then(data => {
          console.log(data);
          this.navCtrl.setRoot(LoginPage);
        })
      }
    });
    console.log('ionViewDidLoad MessageDetailPage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
