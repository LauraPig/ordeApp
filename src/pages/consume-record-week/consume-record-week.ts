import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from '@ionic/storage';

/**
 * Generated class for the ConsumeRecordWeekPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'consume-record-week'
})
@Component({
  selector: 'page-consume-record-week',
  templateUrl: 'consume-record-week.html',
})
export class ConsumeRecordWeekPage {

  userId: string;
  orderList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public httpDataPro: HttpDataProviders,
  ) {
  }

  ionViewDidLoad() {

    this.orderList = [];
    let weekOfday = Number(moment().format('E'));//计算今天是这周第几天

    let lastMonday = `${moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')} 00:00:00`;   //周一日期
    let lastSunday = `${moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD')} 23:59:59`;   //周日日期
    this.storage.get('userId').then(res =>{
      if (res) {
        this.userId = res;
        this.getListData(res, lastMonday, lastSunday);
      }
    });
    console.log('ionViewDidLoad ConsumeRecordWeekPage');
  }

  getListData(id: string, queryStartDate: string, queryEndDate: string ) {
    let dataLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...'
    });
    dataLoading.present();
    if (id && queryEndDate && queryStartDate) {
      let params = {
        'userId': id,
        'status': '1',
        'queryStartDate': queryStartDate,
        'queryEndDate': queryEndDate,
      };
      this.httpDataPro.fetchRecordListData(params).then(res =>{
        if (res.success) {
          this.orderList = res.body.ctOrderList && res.body.ctOrderList.map((item, index) => {
            item.dinnerDate = moment(item.dinnerDate).format('MM月DD日 HH:MM');
            return item;
          });
          dataLoading.dismiss();
        }
      }).catch(e =>{
        dataLoading.dismiss();
      });
    } else {
      dataLoading.dismiss();
    }
  }

}
