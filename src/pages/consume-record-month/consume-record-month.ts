import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

/**
 * Generated class for the ConsumeRecordMonthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'consume-record-month'
})
@Component({
  selector: 'page-consume-record-month',
  templateUrl: 'consume-record-month.html',
})
export class ConsumeRecordMonthPage {

  userId: string;
  orderList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
  ) {
  }

  ionViewDidLoad() {
    this.orderList = [];
    // let weekOfday = Number(moment().format('E'));//计算今天是这周第几天
    let firstDay = `${moment().format('YYYY-MM')}-01 00:00:00`;   // 开始日期
    let lastDay = `${moment().format('YYYY-MM-DD HH:MM:SS')}`;   // 今天日期
    this.storage.get('userId').then(res =>{
      if (res) {
        this.userId = res;
        this.getListData(res, firstDay, lastDay);
      }
    });

    console.log('ionViewDidLoad ConsumeRecordThreeMonthsPage');
  }

  getListData(id: string, queryStartDate: string, queryEndDate: string ) {
    if (id && queryEndDate && queryStartDate) {

      // alert('res-queryStartDate--' + queryStartDate);
      // alert('res-queryEndDate--' + queryEndDate);
      let params = {
        'userId': id,
        'status': '1',
        'queryStartDate': queryStartDate,
        'queryEndDate': queryEndDate,
      };
      this.httpDataPro.fetchRecordListData(params).then(res =>{
        // alert('res-data--' + JSON.stringify(res.body.ctOrderList));
        if (res.success) {
          this.orderList = res.body.ctOrderList && res.body.ctOrderList.map((item, index) => {
              item.dinnerDate = moment(item.dinnerDate).format('MM月DD日 HH:MM');
              return item;
            });
        }

      }).catch(e =>{

      });
    }

  }

}
