import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from '@ionic/storage';
import {LoginPage} from "../login/login";
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
  ) {
    this.item = this.navParams.get('item');
  }

  ionViewDidLoad() {
    let reqDateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    let params = {
      'pushDate': reqDateStr,
      'flag': '0'
    };
    this.httpDataPro.fetchHasMessage(params).then (res => {
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
}
