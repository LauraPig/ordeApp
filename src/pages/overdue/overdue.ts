import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import * as moment from "moment";
import _date = moment.unitOfTime._date;
import {LoginPage} from "../login/login";

/**
 * Generated class for the OverduePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-overdue',
  templateUrl: 'overdue.html',
})
export class OverduePage {

  userId: string;
  messageCount: number;
  // dataList: Array<any> = [];
  orderList: Array<any> = [];
  isNull: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
    public loadingCtrl: LoadingController,
  ) {

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad OverduePage');
  }

  ionViewDidEnter() {
    this.isNull = this.orderList.length === 0;
  }

  ionViewWillEnter() {
    this.storage.get('messageCount').then(res =>{
      if (res) {
        this.messageCount = res;
      }
    });
    let dateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    // alert('date--' + dateStr);
    this.storage.get('userId').then(res =>{
      if (res && dateStr) {
        this.userId = res;
        this.getOverDueData(res, dateStr);
      }
    });
  }

  getOverDueData(id: string, dateStr: string) {

    this.orderList = [];

    let dataLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...',
    });
    dataLoading.present();
    if (id && dateStr) {
      let params = {
        id,
        'date': dateStr
      };
      this.httpDataPro.fetchOverDueData(params).then(res => {
        // dataLoading.dismiss();
        // alert('res-length--' + res.body.orderList.length);
        if (res.success) {
          this.orderList  = res.body.orderList && res.body.orderList.map((item, index) => {
            item.dinnerDate = moment(item.dinnerDate).format('YYYY-MM-DD');
            if (index === res.body.orderList.length - 1) {
              dataLoading.dismiss();
            }
            return item;
          });
        } else if (res.errorCode === '-2') {
          dataLoading.dismiss();
          alert('登录信息过期，请重新登录');
          this.storage.remove('token').then(data => {
            console.log(data);
            this.navCtrl.setRoot(LoginPage);
          })
        }
      }).catch(e =>{
        console.log(e);
        dataLoading.dismiss();
      });
    }
    dataLoading.dismiss();
  }

  gotoUnreadMessage() {
    this.navCtrl.push('unread-message');
  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }

  goSettingPage() {
    this.navCtrl.push('setting');
  }

}
