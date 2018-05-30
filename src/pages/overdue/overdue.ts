import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import * as moment from "moment";
import _date = moment.unitOfTime._date;

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
  // dataList: Array<any> = [];
  orderList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
  ) {

  }

  ionViewDidLoad() {
    let dateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    // alert('date--' + dateStr);
    this.storage.get('userId').then(res =>{
      if (res && dateStr) {
        this.userId = res;
        this.getOverDueData(res, dateStr);
      }
    });
    console.log('ionViewDidLoad OverduePage');
  }

  getOverDueData(id: string, dateStr: string) {
    if (id && dateStr) {
      let params = {
        id,
        'date': dateStr
      };
      this.httpDataPro.fetchOverDueData(params).then(res => {
        // alert('res-length--' + res.body.orderList.length);
        if (res.success) {
          this.orderList  = res.body.orderList && res.body.orderList.map((item, index) => {
            item.dinnerDate = moment(item.dinnerDate).format('YYYY-MM-DD');
            return item;
          });
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
