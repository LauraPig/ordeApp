import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import * as moment from "moment";
import {LoginPage} from "../login/login";
import {CommonHelper} from "../../providers/common-helper";

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

  messageCount: number;
  orderList: Array<any> = [];
  isNull: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public commonHelper: CommonHelper,
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
    this.commonHelper.getHasUnreadMessage();
    this.storage.get('messageCount').then(res =>{
      if (res) {
        this.messageCount = res;
      }
    });
    let dateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    this.getOverDueData(dateStr);
  }

  getOverDueData(dateStr: string) {

    this.orderList = [];

    let dataLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...',
    });
    dataLoading.present();
    if (dateStr) {
      let params = {
        'date': dateStr
      };
      this.httpDataPro.fetchOverDueData(params).then(res => {
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

  gotoHomePage() {
    this.commonHelper.GoBackHomePage();
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
