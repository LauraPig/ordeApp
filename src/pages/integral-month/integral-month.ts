import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LoginPage} from "../login/login";
import * as moment from 'moment';
import {getCurrentMonth} from "../../utils/index";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import { Storage } from "@ionic/storage";

/**
 * Generated class for the IntegralMonthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'integral-month'
})
@Component({
  selector: 'page-integral-month',
  templateUrl: 'integral-month.html',
})
export class IntegralMonthPage {

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
    console.log('ionViewDidLoad IntegralMonthPage');
  }

  ionViewDidEnter() {
    //  判断是否没有数据
    this.isNull = this.orderList.length === 0;
  }

  ionViewWillEnter() {
    this.orderList = [];
    let month = new Date().getMonth() + 1;
    const [startTime, ] = getCurrentMonth(month); //  开始时间
    let endTime = moment().format('YYYY-MM-DD HH:mm:ss'); //  结束时间
    this.getListData(startTime, endTime);

  }

  //  根据时间段获取数据
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
      this.httpDataPro.getIntegralDetail(params).then(res =>{
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
