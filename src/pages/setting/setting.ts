import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from  '../../pages/home/home';
import { ListPage } from  '../../pages/list/list';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'setting'
})
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  openPage(page: string) {
    switch (page) {
      case 'homePage':
        this.navCtrl.setRoot(HomePage);
        break;
      case 'listPage':
        this.navCtrl.push(ListPage);
        break;
      default:
      // break;
    }
  }

  openPersonInfo() {
    this.navCtrl.push('personal-info');
  }
  openSelectLocation () {
    this.navCtrl.push('select-location');
  }

  openAboutPage () {
    this.navCtrl.push('about');
  }

  openRechargePage () {
    this.navCtrl.push('recharge');
  }

}
