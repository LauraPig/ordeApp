import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from '@ionic/storage';
import {LoginPage} from "../login/login";

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
  constructor(
    public navCtrl: NavController,
    public httpDataPro: HttpDataProviders,
    public storage: Storage,
    public navParams: NavParams,
  ) {

  }

  ionViewWillEnter() {
    this.getPersonInfo();
    console.log('ionViewDidLoad PersonalInfoPage');
  }

  getPersonInfo() {
    let params ={
      // 'token': token,
    }
    this.httpDataPro.fetchPersonInfoData(params).then(res =>{
      // alert('res-data:' + JSON.stringify(res));
      if (res.success && res.body) {
        const temObj = {...res.body.user};
        // alert('res-before:' + temObj.name);
        temObj.name = temObj.name.indexOf('(') > -1 ? temObj.name.match('\\((.+?)\\)')[1] : temObj.name;
        // alert('res-username:' + temObj.name);

        this.userInfo = {...temObj};

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
    });
  }

  goQRCode(no: string) {
    this.navCtrl.push('qr-code', {
      no
    });
  }

}
