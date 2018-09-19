import { Component, ViewChild } from '@angular/core';

import {
  Platform, MenuController, Nav, LoadingController, Loading, ToastController,
  AlertController, IonicApp, App, NavController
} from 'ionic-angular';

import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataBaseService } from '../providers/database/database';

import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../providers/http-data/http-data";
import {LoginPage} from "../pages/login/login";

import * as moment from 'moment'; //时间处理模块
import {NativeService} from "../providers/app-update/NativeService";
import {TranslateService} from "ng2-translate";
import {CommonHelper} from "../providers/common-helper";
import {ConsumeRecordPage} from "../pages/consume-record/consume-record";
import {ZBar, ZBarOptions} from "@ionic-native/zbar";
import {OverduePage} from "../pages/overdue/overdue";
import {WaitingUsePage} from "../pages/waiting-use/waiting-use";
import {IntegralPage} from "../pages/integral/integral";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  backButtonPressed: boolean = false; //物理返回键

  loading: Loading ;
  coldVersion: number = 0;
  isFetchCold: boolean = false;
  isFetchHot: boolean = false;
  hotVersion: number = 0;
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  // rootPage = HomePage;
  rootPage: any;
  pages: Array<{title: string, component: any}>;
  token: string;

  //我的消息条数
  messageCount: number;


  // 积分
  integral: string;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public dbService: DataBaseService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public sqlite: SQLite,
    public appCtrl: App,
    public zbar: ZBar,
    public httpDataProviders: HttpDataProviders,
    public ionicApp: IonicApp,
    public commonHelper: CommonHelper,
    public translate: TranslateService,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
    public nativeService: NativeService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //检查是否需要更新
      this.nativeService.detectionUpgrade(true);

      // 物理返回键问题
      this.registerBackButtonAction();


      // 设置默认语言
      // this.translate.setDefaultLang('en');
      this.translate.setDefaultLang('zh');


      // 判断是否登录
      this.storage.get('token').then(res =>{
        // alert('res-->' + res);
        if (res) {
          this.commonHelper.getHasMessageAndAlert();
          this.token = res;
          this.rootPage = HomePage;
        } else {
          this.rootPage = LoginPage;
        }

      });

      //  轮询获取最新消息
      setInterval(this.commonHelper.getHasUnreadMessage, 300000);
    });
  }

  // 物理返回键事件注册
  registerBackButtonAction(){
    this.platform.registerBackButtonAction(()=>{
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss().catch(() => {});
        activePortal.onDidDismiss(() => {});
        return;
      }
      let activeNav: NavController = this.appCtrl.getActiveNavs()[0];
      return activeNav.canGoBack() ? activeNav.pop() : this.showExit();//另外两种方法在这里将this.showExit()改为其他两种的方法的逻辑就好。
    },999);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'middle'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }



  gotoHome() {
    this.menu.close();
    this.nav.setRoot(HomePage);
  }



  // 我的积分
  gotoIntegral() {
    this.menu.close();
    this.nav.push(IntegralPage);
    // this.nav.push('integral-page');
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
        this.nav.pop();
      })
      .catch(error => {
        alert(error); // Error message
      });
  }

  // 跳转到未读消息列表
  gotoUnreadMessage() {
    this.menu.close();
    this.nav.push('unread-message');
  }

  //  待消费
  openWaitingUse () {
    this.menu.close();
    this.nav.setRoot(WaitingUsePage);
  }

  //  历史消费记录
  openConsumeRecord() {
    this.menu.close();
    this.nav.setRoot(ConsumeRecordPage);
  }

  //  逾期未取餐
  openOverdue() {
    this.menu.close();
    this.nav.setRoot(OverduePage);
  }

}
