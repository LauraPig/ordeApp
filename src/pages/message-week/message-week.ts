import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {LoginPage} from "../login/login";
import {Storage} from '@ionic/storage';
import { getCurrentMonth } from "../../utils/index";
import {MessageDetailPage} from "../message-detail/message-detail";
import {CommonHelper} from "../../providers/common-helper";
/**
 * Generated class for the MessageWeekPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'message-week'
})
@Component({
  selector: 'page-message-week',
  templateUrl: 'message-week.html',
})
export class MessageWeekPage {
  messageList: Array<any> = [];
  isNull: boolean = false;
  startTime: string;
  endTime: string;

  constructor(
    public navCtrl: NavController,
    public httpDataPro: HttpDataProviders,
    public navParams: NavParams,
    public storage: Storage,
    public commonHelper: CommonHelper,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessageWeekPage');
  }

  ionViewWillEnter() {
    this.messageList = [];
    let month = new Date().getMonth() + 1;
    [this.startTime, ] = getCurrentMonth(month);
     this.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
    this.getListData(this.startTime, this.endTime, true);
  }

  ionViewDidEnter() {
    this.isNull = this.messageList.length === 0;
  }

  getListData(startTime: string, endTime: string, isShowLoading?: boolean ) {

    isShowLoading ? this.commonHelper.LoadingShow('加载中...') : null;
    if (startTime && endTime) {
      let params = {
        'startTime': startTime,
        'endTime': endTime,
      };
      this.httpDataPro.fetchAllMessageData(params).then(res =>{
        isShowLoading ? this.commonHelper.LoadingHide() : null;
        if (res.success) {
          this.messageList = res.body.sysMessageList && res.body.sysMessageList.map((item, index) => {
              item.pushDate = moment(item.pushDate).format('YYYY-MM-DD');
              return item;
            });
        } else if (res.errorCode === '-2') {
          alert('登录信息过期，请重新登录');
          this.storage.remove('token').then(data => {
            console.log(data);
            this.navCtrl.setRoot(LoginPage);
          })
        }
      }).catch(e =>{
        isShowLoading ? this.commonHelper.LoadingHide() : null;
      });
    } else {
      isShowLoading ? this.commonHelper.LoadingHide() : null;
    }
  }

  gotoMessageDetail (item: any) {
    this.commonHelper.LoadingShow('跳转中...');
    let detailModal = this.modalCtrl.create('message-detail-modal',{
      item,
    });
    let params = {
      'id': item.id,
    };
    this.httpDataPro.changeMessageStatus(params).then (res => {
      this.commonHelper.LoadingHide();
      if (res.success) {

        this.getListData(this.startTime, this.endTime, false);
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
