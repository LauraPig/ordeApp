import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";

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
  dataList: Array<any> = [];
  orderList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
  ) {

  }

  ionViewDidLoad() {
    this.storage.get('userId').then(res =>{
      if (res) {
        this.userId = res;
        this.getOverDueData(res);
      }
    });
    console.log('ionViewDidLoad OverduePage');
  }

  getOverDueData(id: string) {
    if (id) {
      let params = {'userId': id};
      this.httpDataPro.fetchOverDueData(params).then(res => {
        alert('res---' + res.body.orderList);
        if (res.success) {
          this.orderList  = res.body.orderList;
        }
      });
    }
  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }

  goSettingPage() {
    this.navCtrl.push('setting');
  }

}
