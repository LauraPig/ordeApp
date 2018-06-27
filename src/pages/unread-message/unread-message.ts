import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {LoginPage} from "../login/login";
import {MessageRecordPage} from "../message-record/message-record";

/**
 * Generated class for the UnreadMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'unread-message'
})
@Component({
  selector: 'page-unread-message',
  templateUrl: 'unread-message.html',
})
export class UnreadMessagePage {
  messageList: Array<any> =[];
  token: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
    public loadingCtrl: LoadingController,
  ) {
    this.storage.get('token').then(res =>{
      if (res) {
        this.token = res;
      }
    });
  }

  ionViewDidLoad() {
    this.getMessageData();
    console.log('ionViewDidLoad UnreadMessagePage');
  }

  getMessageData () {
    let dataLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...',
    });
    dataLoading.present();
    let reqDateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    // alert('date--->' + reqDateStr);
    let params = {
      'pushDate': reqDateStr,
      'flag': '1'
    };
    this.httpDataPro.fetchHasMessage(params).then (res => {
      dataLoading.dismiss();
      // alert('res--->' + JSON.stringify(res));
      if (res.success) {
        this.messageList = res.body.sysMessageList.map((item,index) => {
          item.pushDate = moment(item.pushDate).format('YYYY-MM-DD');
          return item;
        });
        // this.storage.set('messageCount', res.body.count);
      } else if (res.errorCode === '-2') {
        alert('登录信息过期，请重新登录');
        this.storage.remove('token').then(data => {
          console.log(data);
          this.navCtrl.setRoot(LoginPage);
        })
      }
    }).catch(e => {
      console.log(e);
      dataLoading.dismiss();
    });
  }

  gotoAllMessage() {
    this.navCtrl.push(MessageRecordPage);
  }


  gotoMessageDetail (item: any) {
    let params = {
      'id': item.id,
    };
    this.httpDataPro.changeMessageStatus(params).then (res => {
      if (res.success) {
        this.navCtrl.push('message-detail', {
          item
        });
      } else if (res.errorCode === '-2') {
        alert('登录信息过期，请重新登录');
        this.storage.remove('token').then(data => {
          console.log(data);
          this.navCtrl.setRoot(LoginPage);
        })
      }
    }).catch(e => {
      console.log(e);
    });
  }
}
