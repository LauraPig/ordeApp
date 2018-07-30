import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {LoginPage} from "../login/login";
import {Storage} from '@ionic/storage';
import { getCurrentMonth } from "../../utils/index";
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

  constructor(
    public navCtrl: NavController,
    public httpDataPro: HttpDataProviders,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl: LoadingController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessageWeekPage');
  }

  ionViewWillEnter() {
    this.messageList = [];
    // let weekOfday = Number(moment().format('E'));//计算今天是这周第几天

    // let lastMonday = `${moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')} 00:00:00`;   //周一日期

    let month = new Date().getMonth() + 1;
    const [startTime, ] = getCurrentMonth(month);
    let endTime = moment().format('YYYY-MM-DD HH:mm:ss');
    // let lastSunday = `${moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD')} 23:59:59`;   //周日日期
    let lastSunday = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;   //今天日期
    this.getListData(startTime, endTime);
  }

  ionViewDidEnter() {
    this.isNull = this.messageList.length === 0;
  }

  getListData(startTime: string, endTime: string ) {

    // alert('startTime:' + startTime);
    // alert('endTime:' + endTime);
    let dataLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...'
    });
    dataLoading.present();
    if (startTime && endTime) {
      let params = {
        'startTime': startTime,
        'endTime': endTime,
      };
      this.httpDataPro.fetchAllMessageData(params).then(res =>{
        // alert('res-data:' + JSON.stringify(res));
        dataLoading.dismiss();
        if (res.success) {
          this.messageList = res.body.sysMessageList && res.body.sysMessageList.map((item, index) => {
              item.pushDate = moment(item.pushDate).format('YYYY-MM-DD');
              return item;
            });
          // dataLoading.dismiss();
        } else if (res.errorCode === '-2') {
          alert('登录信息过期，请重新登录');
          this.storage.remove('token').then(data => {
            console.log(data);
            this.navCtrl.setRoot(LoginPage);
          })
        }
      }).catch(e =>{
        dataLoading.dismiss();
      });
    } else {
      dataLoading.dismiss();
    }
  }

  // gotoMessageDetail (item: any) {
  //   let params = {
  //     'id': item.id,
  //   };
  //   this.httpDataPro.changeMessageStatus(params).then (res => {
  //     if (res.success) {
  //       this.navCtrl.push('message-detail', {
  //         item
  //       });
  //     } if (res.errorCode === -2) {
  //       alert('登录信息过期，请重新登录');
  //       this.navCtrl.setRoot(LoginPage);
  //     }
  //   }).catch(e => {
  //     console.log(e);
  //   });
  // }

}
