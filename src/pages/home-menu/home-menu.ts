import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { ListPage } from '../../pages/list/list';
import { WeekMenuPage } from '../../pages/week-menu/week-menu';
import {ConsumeRecordPage} from "../consume-record/consume-record";
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {OverduePage} from "../overdue/overdue";
import {LoginPage} from "../login/login";
import {HttpProvider} from "../../providers/http/http-service";
import {Storage} from '@ionic/storage';
import {ZBar, ZBarOptions} from "@ionic-native/zbar";
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
  messageCount: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public zbar: ZBar,
    public httpPro: HttpProvider,
    public storage: Storage,
  ) {

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
    this.storage.get('messageCount').then(res =>{
      if (res) {
        this.messageCount = res;
      }

    });
    // this.initData();
    console.log('ionViewDidLoad HomeMenuPage');
  }

  ionViewWillEnter() {
    this.storage.get('messageCount').then(res =>{
      if (res) {
        this.messageCount = res;
      }

    });
    this.initData();
  }

  initData () {
    let params = [
      {
        'versionNo': 0,
        'type': '0'
      },
      {
        'versionNo': 0,
        'type': '1'
      }
    ];
    this.httpPro.httpPostWithAuth('/data/', params).then(data => {
      // alert('结果' + data.success);
    }).catch(e => {
      // alert('错误==》' + JSON.stringify(e));
    });
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

  // 扫一扫功能

  qrScan() {
    let options: ZBarOptions = {
      flash: 'off',
      text_title: '扫码',
      text_instructions: '请将二维码置于红线中央',
      // camera: "front" || "back",
      drawSight: true
    };

    this.zbar.scan(options)
      .then(result => {
        alert("结果：" + result); // Scanned code
        this.navCtrl.pop();
      })
      .catch(error => {
        alert(error); // Error message
      });
  }

  gotoUnreadMessage() {
    this.navCtrl.push('unread-message');
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
