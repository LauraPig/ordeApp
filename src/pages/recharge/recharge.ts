import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import { Storage } from '@ionic/storage';

import {WechatChenyu} from "wechat-chenyu"

/**
 * Generated class for the RechargePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'recharge'
})
@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html',
})
export class RechargePage {
  amount: number;
  userId: string;
  timeStamp: string;

  constructor(
    public navCtrl: NavController,
    public httpDataPro: HttpDataProviders,
    public storage: Storage,
    public wechatChenyu: WechatChenyu,
    public navParams: NavParams,
  ) {
    this.storage.get('userId').then(res =>{
      if (res) {
        this.userId = res;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RechargePage');
  }

  doRecharge() {
    // this.timeStamp = moment();

    this.timeStamp = new Date().getTime().toString();

    alert('timeStamp--->' + this.timeStamp );
    alert('userId--->' + this.userId );
    alert('amount--->' + this.amount );
    if ( this.timeStamp && this.userId && this.amount) {
      let params = {
        'userId': this.userId,
        'timeStamp': this.timeStamp,
        'amount': this.amount,
      };

      this.httpDataPro.doWxPay(params).then(res => {
        if (res.success) {
          let payinfo: JSON = JSON.parse(res.data);
          this.wechatChenyu.isInstalled().then((res) =>{
            this.wechatChenyu.sendPaymentRequest(payinfo).then((data) => {
                //成功之后的跳转...
                if (data) {

                }
              }, err => {
                alert(err);
                console.log(err); // Failed
              }
            );
          })
        }

      });
    }

  }

}
