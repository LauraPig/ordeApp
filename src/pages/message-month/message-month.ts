import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {LoginPage} from "../login/login";
import {Storage} from '@ionic/storage';
import {getCurrentMonth} from "../../utils/index";

/**
 * Generated class for the MessageMonthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'message-month'
})
@Component({
  selector: 'page-message-month',
  templateUrl: 'message-month.html',
})
export class MessageMonthPage {
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
    console.log('ionViewDidLoad MessageMonthPage');
  }

  ionViewWillEnter() {
    let month = new Date().getMonth();
    const [startTime, endTime] = getCurrentMonth(month);
    this.messageList = [];
    // let weekOfday = Number(moment().format('E'));//计算今天是这周第几天
    // let firstDay = `${moment().format('YYYY-MM')}-01 00:00:00`;   // 开始日期
    // let lastDay = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;   // 今天日期
    // let lastDay = `${moment().format('YYYY-MM-DD')} 23:59:59`;   // 今天日期
    this.getListData(startTime, endTime);
  }

  ionViewDidEnter() {
    this.isNull = this.messageList.length === 0;
  }


  getListData(queryStartDate: string, queryEndDate: string ) {
    let dataLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...'
    });
    dataLoading.present();
    if (queryStartDate && queryEndDate) {
      // alert('startTime-->' + queryStartDate);
      // alert('endTime-->' + queryEndDate);
      let params = {
        'startTime': queryStartDate,
        'endTime': queryEndDate,
      };
      this.httpDataPro.fetchAllMessageData(params).then(res =>{
        // alert('res-data-month:' + JSON.stringify(res));

        dataLoading.dismiss();
        if (res.success) {
          this.messageList = res.body.sysMessageList && res.body.sysMessageList.map((item, index) => {
              item.pushDate = moment(item.pushDate).format('YYYY-MM-DD');
              return item;
            });
        } else if (res.errorCode === '-2') {
          alert(res.msg);
          this.storage.remove('token').then(res => {
            console.log(res);
            this.navCtrl.setRoot(LoginPage);
          });
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
