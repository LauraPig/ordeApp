import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { productList } from '../../mock/mock-data';

/**
 * Generated class for the WeekMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-week-menu',
  templateUrl: 'week-menu.html',
})
export class WeekMenuPage {

  productList: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.productList = productList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeekMenuPage');
  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }

  goSettingPage() {
    this.navCtrl.push('setting');
  }

  gotoMenuType(item: object, index: number) {
    this.navCtrl.push('WeekMenuType', {
      item: item,
      index: index
    })
  }




}
