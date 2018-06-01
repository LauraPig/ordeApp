import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from '@ionic/storage';

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
  userId: string;
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

  ionViewDidLoad() {
    this.storage.get('userId').then(res => {
      if (res) {
        this.userId = res;
        this.getPersonInfo(res);
      }

    });
    console.log('ionViewDidLoad PersonalInfoPage');
  }

  getPersonInfo(id: string) {
    if (id) {
      let params ={
        'id': id,
      }
      this.httpDataPro.fetchPersonInfoData(params).then(res =>{
        // alert('res-data:' + JSON.stringify(res));
        if (res.success && res.body) {
          this.userInfo = res.body.user;
          this.accountInfo = res.body.accounList;
          this.accountInfo.map((item, index) =>{
            if (item.accountType === '0') {
              this.cashAccount = item.balance;
            }
            if (item.accountType === '1') {
              this.creditAccount = item.balance;
            }
          })
        }
      });
    }

  }

  goQRCode(no: string) {
    this.navCtrl.push('qr-code', {
      no
    });
  }

}
