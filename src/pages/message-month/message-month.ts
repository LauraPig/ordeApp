import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {HttpDataProviders} from "../../providers/http-data/http-data";

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

  constructor(
    public navCtrl: NavController,
    public httpDataPro: HttpDataProviders,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
  ) {
  }

  ionViewDidLoad() {


    this.messageList = [];
    // let weekOfday = Number(moment().format('E'));//计算今天是这周第几天
    let firstDay = `${moment().format('YYYY-MM')}-01 00:00:00`;   // 开始日期
    let lastDay = `${moment().format('YYYY-MM-DD HH:MM:SS')}`;   // 今天日期
    this.getListData(firstDay, lastDay);

    console.log('ionViewDidLoad MessageMonthPage');
  }

  getListData(queryStartDate: string, queryEndDate: string ) {
    let dataLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...'
    });
    dataLoading.present();
    if (queryEndDate && queryStartDate) {
      let params = {
        'startTime': queryStartDate,
        'endTime': queryEndDate,
      };
      this.httpDataPro.fetchAllMessageData(params).then(res =>{
        dataLoading.dismiss();
        if (res.success) {
          this.messageList = res.body.sysMessageList && res.body.ctOrderList.map((item, index) => {
              item.pushDate = moment(item.pushDate).format('YYYY-MM-DD');
              return item;
            });
        }
      }).catch(e =>{
        dataLoading.dismiss();
      });
    } else {
      dataLoading.dismiss();
    }
  }

}
