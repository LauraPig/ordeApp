import { Component, ViewChild } from '@angular/core';

import {
  Platform, MenuController, Nav, LoadingController, Loading, ToastController,
  AlertController
} from 'ionic-angular';

import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataBaseService } from '../providers/database/database';

import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../providers/http-data/http-data";
import {LoginPage} from "../pages/login/login";

import * as moment from 'moment';
import {NativeService} from "../providers/app-update/NativeService";
import {TranslateService} from "ng2-translate";
import {CommonHelper} from "../providers/common-helper";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

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
    public commonHelper: CommonHelper,
    public translate: TranslateService,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
    public nativeService: NativeService,
    // public sqliteObj: SQLiteObject,
  ) {
    this.initializeApp();
    // setInterval(this.getHasMessage(),5000);
    // this.getHasMessage();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //检查是否需要更新
      this.nativeService.detectionUpgrade(true);

      // 设置默认语言
      // this.translate.setDefaultLang('en');
      this.translate.setDefaultLang('zh');

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

  // 轮询获取消息
  getHasMessage () {
    let reqDateStr = moment().format('YYYY-MM-DD HH:mm:ss');
    // this.storage.get('token').then(res =>{
    //   if (res) {
    //     this.token = res;
    //   }
    // });
    let params = {
      'pushDate': reqDateStr,
      'flag': '0'
    };
    this.httpDataPro.fetchHasMessage(params).then (res => {
      // alert('res-in-count->' + JSON.stringify(res));
      if (res.success) {
        this.storage.set('messageCount', res.body.count);

        if (res.body.count > 0) {
          let params = {
            'pushDate': reqDateStr,
            'flag': '1'
          };
          this.httpDataPro.fetchMessageListData(params).then(data => {
            // alert('res-in-messageDetail->' + JSON.stringify(data));
            if (data.success) {
              let temObj = data.body.sysMessageList[0];
              // alert('res-in-reqDateStr->' + reqDateStr);
              // alert('res-in-endDate->' + temObj.endDate);
              // alert(moment(reqDateStr).isBefore(temObj.endDate));
              if (moment(reqDateStr).isBefore(temObj.endDate)) {
                this.alertCtrl.create({
                  title: temObj.head || '消息提示',
                  subTitle: temObj.body || '',
                  enableBackdropDismiss: false,
                  buttons: [
                    {
                      text: '确定',
                      handler: res => {
                        console.log(res);
                        this.httpDataPro.changeMessageStatus({'id': temObj.id}).then(res =>{
                          console.log(res);
                        }).catch(e =>{
                          console.log(e);
                        });
                      }
                    }
                  ]
                }).present();
              }
            }
          }).catch( e =>{

          });
        }
      }
    });
  }
}
