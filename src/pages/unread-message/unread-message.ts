import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {LoginPage} from "../login/login";
import {MessageRecordPage} from "../message-record/message-record";
import {CommonHelper} from "../../providers/common-helper";

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
  isNull: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonHelper: CommonHelper,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
  ) {
    this.storage.get('token').then(res =>{
      if (res) {
        this.token = res;
      }
    });
  }

  ionViewWillEnter() {
    this.getMessageData(true);
    console.log('ionViewDidLoad UnreadMessagePage');
  }


  ionViewDidEnter() {
    this.isNull = this.messageList.length === 0;
  }

  getMessageData (isShowLoading?: boolean) {
    this.messageList = [];
    isShowLoading ? this.commonHelper.LoadingShow('加载中...') : null;
    let reqDateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    // alert('date--->' + reqDateStr);
    let params = {
      'pushDate': reqDateStr,
      'flag': '1'
    };
    this.httpDataPro.fetchHasMessage(params).then (res => {
      isShowLoading ? this.commonHelper.LoadingHide() : null;
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
      isShowLoading ? this.commonHelper.LoadingHide() : null;
      console.log(e);
    });
  }

  gotoAllMessage() {
    this.navCtrl.push(MessageRecordPage);
  }


  gotoMessageDetail (item: any) {
    let detailModal = this.modalCtrl.create('message-detail-modal',{
      item,
    });
    this.commonHelper.LoadingShow('跳转中...');
    let params = {
      'id': item.id,
    };
    this.httpDataPro.changeMessageStatus(params).then (res => {
      this.commonHelper.LoadingHide();
      if (res.success) {
        this.getMessageData(false);
        detailModal.present();
      } else if (res.errorCode === '-2') {
        alert('登录信息过期，请重新登录');
        this.storage.remove('token').then(data => {
          console.log(data);
          this.navCtrl.setRoot(LoginPage);
        })
      }
    }).catch(e => {
      this.commonHelper.LoadingHide();
      console.log(e);
    });
  }
}
