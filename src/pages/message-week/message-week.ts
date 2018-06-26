import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {HttpDataProviders} from "../../providers/http-data/http-data";
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

  constructor(
    public navCtrl: NavController,
    public httpDataPro: HttpDataProviders,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
  ) {
  }

  ionViewDidLoad() {
    this.messageList = [];
    let weekOfday = Number(moment().format('E'));//计算今天是这周第几天

    let lastMonday = `${moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')} 00:00:00`;   //周一日期
    let lastSunday = `${moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD')} 23:59:59`;   //周日日期
    this.getListData(lastMonday, lastSunday);

    console.log('ionViewDidLoad MessageWeekPage');
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
          // dataLoading.dismiss();
        }
      }).catch(e =>{
        dataLoading.dismiss();
      });
    } else {
      dataLoading.dismiss();
    }
  }

}
