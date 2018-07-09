import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { HomePage } from  '../../pages/home/home';
import { ListPage } from  '../../pages/list/list';
import { Storage } from  '@ionic/storage';
import {LoginPage} from "../login/login";
import { AppVersion } from '@ionic-native/app-version';
import {NativeService} from "../../providers/app-update/NativeService";

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
  appVersionStr: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public alertCtrl: AlertController,
    public appVersion: AppVersion,
    public nativeService: NativeService,
  ) {
  }

  ionViewWillEnter() {
    this.appVersion.getVersionNumber().then(res =>{
      if (res) {
        this.appVersionStr = res;
        // alert('appVersion--->' + res);
      }
    });
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

  // 检查是否有新版本
  checkUpdate() {
    this.nativeService.detectionUpgrade();
  }

  logout() {
    this.alertCtrl.create({
      title: '退出登录',
      subTitle: '确定退出当前账号？',
      buttons: [
        {
          text: '取消',
          handler: data => {
            // this.navCtrl.setRoot()
          }
        },
        {
          text: '确定',
          handler: data => {
            this.storage.remove('token').then(() => {
              this.navCtrl.setRoot(LoginPage)
            });
            console.log(data);
            // this.navCtrl.setRoot()
          }
        }
      ]
    }).present();
  }

  openLaws () {
    this.navCtrl.push('laws-regulations');
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
