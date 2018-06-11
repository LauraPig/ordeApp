import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import { Storage } from '@ionic/storage';

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
    this.timeStamp = new Date().getTime();
    if ( this.timeStamp && this.userId && this.amount) {
      let params = {
        'userId': this.userId,
        'timeStamp': this.timeStamp,
        'amount': this.amount,
      };

      this.httpDataPro.doWxPay(params).then(res => {
        
      });
    }

  }

}
