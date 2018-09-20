import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {getCurrentMonth} from "../../utils";

/**
 * Generated class for the IntegralThreeMonthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'integral-three-month'
})
@Component({
  selector: 'page-integral-three-month',
  templateUrl: 'integral-three-month.html',
})
export class IntegralThreeMonthPage {

  orderList: Array<any> = [];// 数据列表
  isNull: boolean = false;// 是否没有数据

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpDataPro: HttpDataProviders,
    public loadingCtrl: LoadingController,
    public storage: Storage,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntegralThreeMonthPage');
  }

  ionViewDidEnter() {
    this.isNull = this.orderList.length === 0;
  }


  ionViewWillEnter() {
    this.orderList = [];
    let month = new Date().getMonth() - 1;
    const [startTime, endTime] = getCurrentMonth(month);//  获取开始和结束时间
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
        // 'status': '1',
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
