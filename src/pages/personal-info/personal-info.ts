import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from '@ionic/storage';
import {LoginPage} from "../login/login";
import * as moment from 'moment';

/**
 * Generated class for the PersonalInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'personal-info'
})
@Component({
  selector: 'page-personal-info',
  templateUrl: 'personal-info.html',
})
export class PersonalInfoPage {
  token: string;
  userInfo: object = {};
  accountInfo: Array<any> = [];
  creditAccount: string;
  cashAccount: string;

  code: string;

  qrCodeStr: string = 'aaa';  // 二维码字符串

  constructor(
    public navCtrl: NavController,
    public httpDataPro: HttpDataProviders,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
  ) {

  }

  ionViewWillEnter() {
    this.getPersonInfo();
    console.log('ionViewDidLoad PersonalInfoPage');
  }

  getPersonInfo() {

    let initLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...'
    });
    initLoading.present();
    let params ={
    }
    this.httpDataPro.fetchPersonInfoData(params).then(res =>{
      initLoading.dismiss();

      if (res.success && res.body) {
        const temObj = {...res.body.user};
        temObj.name = temObj.name.indexOf('(') > -1 ? temObj.name.match('\\((.+?)\\)')[1] : temObj.name;

        this.userInfo = {...temObj};
        this.code = temObj.code;

        let timestampStr = moment().format('x');
        this.qrCodeStr = `esquel,${this.code},${timestampStr}`;

        this.accountInfo = res.body.accounList;
        this.accountInfo.map((item, index) =>{
          if (item.accountType === '0') {
            this.cashAccount = item.balance;
          }
          if (item.accountType === '1') {
            this.creditAccount = item.balance;
          }
        })
      } else if (res.errorCode === '-2') {
        alert('登录信息过期，请重新登录');
        this.storage.remove('token').then(data => {
          console.log(data);
          this.navCtrl.setRoot(LoginPage);
        })
      }
    }).catch(e =>{
      console.log(e);
      initLoading.dismiss();
    });
  }

  //  刷新二维码
  refreshQRcode() {
    let timestampStr = moment().format('x');
    this.qrCodeStr = `esquel,${this.code},${timestampStr}`;
  }


}
