import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from "@ionic/storage";
import {getCurrentMonth} from "../../utils";

/**
 * Generated class for the IntegralTwoMonthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'integral-two-month'
})
@Component({
  selector: 'page-integral-two-month',
  templateUrl: 'integral-two-month.html',
})
export class IntegralTwoMonthPage {

  orderList: Array<any> = [];
  isNull: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpDataPro: HttpDataProviders,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntegralTwoMonthPage');
  }

  ionViewDidEnter() {
    this.isNull = this.orderList.length === 0;
  }


  ionViewWillEnter() {
    this.orderList = [];
    // let weekOfday = Number(moment().format('E'));//计算今天是这周第几天
    // let firstDay = `${moment().format('YYYY-MM')}-01 00:00:00`;   // 开始日期
    // let lastDay = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;   // 今天日期

    let month = new Date().getMonth();
    const [startTime, endTime] = getCurrentMonth(month);
    this.getListData(startTime, endTime);
  }

  getListData(queryStartDate: string, queryEndDate: string ) {

    // alert('queryStartDate-consume-week-->' + queryStartDate);
    // alert('queryEndDate--in-consume-week-->' + queryEndDate);

    let dataLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...'
    });
    dataLoading.present();

    if (queryEndDate && queryStartDate) {
      let params = {
        // 'status': '1',
        'startTime': queryStartDate,
        'endTime': queryEndDate,
      };
      this.httpDataPro.getIntegralDetail(params).then(res =>{
        // alert('res-data--' + JSON.stringify(res.body.ctOrderList));
        dataLoading.dismiss();
        if (res.success) {
          this.orderList = res.body.list || [];
          this.isNull = this.orderList.length === 0;
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

}
