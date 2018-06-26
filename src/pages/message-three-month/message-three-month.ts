import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {HttpDataProviders} from "../../providers/http-data/http-data";
/**
 * Generated class for the MessageThreeMonthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'message-three-months'
})
@Component({
  selector: 'page-message-three-month',
  templateUrl: 'message-three-month.html',
})
export class MessageThreeMonthPage {

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
    let firstDay = `${moment().subtract(89, 'days').format('YYYY-MM-DD')} 00:00:00`;   // 开始日期
    let lastDay = `${moment().format('YYYY-MM-DD')} 23:59:59`;   // 今天日期
    this.getListData(firstDay, lastDay);

    console.log('ionViewDidLoad MessageThreeMonthPage');
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
