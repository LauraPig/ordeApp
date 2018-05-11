import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { ListPage } from '../../pages/list/list';
import { WeekMenuPage } from '../../pages/week-menu/week-menu';
import {ConsumeRecordPage} from "../consume-record/consume-record";
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {OverduePage} from "../overdue/overdue";
import {LoginPage} from "../login/login";
// import {TestPage} from "../test/test";

/**
 * Generated class for the HomeMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "homeMenu"
})
@Component({
  selector: 'page-home-menu',
  templateUrl: 'home-menu.html',
})
export class HomeMenuPage {

  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: any}>;
  otherPages: Array<{title: string, component: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    // this.pages = [
    //   { title: '立即预订', component: HomePage },
    //   { title: '一周菜单', component: ListPage },
    //   { title: '待消费', component: ListPage }
    // ];
    // this.otherPages = [
    //   {title: '历史用餐几率',}
    // ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeMenuPage');
  }

  openPage(page: string) {
    switch (page) {
      case 'homePage':
        this.navCtrl.setRoot(HomePage);
        break;
      case 'listPage':
        this.navCtrl.push(ListPage);
        break;
      case 'weekMenu':
        this.navCtrl.setRoot(WeekMenuPage);
        break;
      default:
        // break;
    }
  }

  openWaitingUse () {
    this.navCtrl.setRoot(WaitingUsePage);
  }
  openConsumeRecord() {
    this.navCtrl.setRoot(ConsumeRecordPage);
  }
  openOverdue() {
    this.navCtrl.setRoot(OverduePage);
  }

  gotoLogin () {
    this.navCtrl.setRoot(LoginPage);
  }

  gotoTest () {
    this.navCtrl.push('test-page');
  }

}
