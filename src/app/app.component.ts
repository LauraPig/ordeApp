import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, LoadingController, Loading, ToastController  } from 'ionic-angular';

import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataBaseService } from '../providers/database/database';

import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../providers/http-data/http-data";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  loading: Loading ;
  coldVersion: number = 0;
  hotVersion: number = 0;
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = HomePage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public dbService: DataBaseService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public sqlite: SQLite,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
    // public sqliteObj: SQLiteObject,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // 判断是否已经初始化数据库
      this.storage.get('HasCreateDb').then(res => {
        console.log('res=====>', res);
        if (!res) {
          this.initDB();
        }
      }).catch(e => {
        console.log(e);
      });

      // 获取本地的coldVersion版本号
      this.storage.get('coldVersion').then(res => {
        if (!res) {
          this.coldVersion = Number(res);
        }
      }).catch(e => {
        console.log(e);
      });

      // hotVersion 版本号
      this.storage.get('hotVersion').then(res => {
        if (!res) {
          this.hotVersion = Number(res);
        }
      }).catch(e => {
        console.log(e);
      });
    });
  }

  // 调用接口，拉取最新数据
  checkData () {
    let params = [
      {
        'versionNo': this.coldVersion,
        'type': '0'
      },
      {
        'versionNo': this.hotVersion,
        'type': '1'
      }
    ];
    this.httpDataPro.fetchInitData(params).then(res => {
      alert('数据' + res.success);
      if (!res.success) {
        return;
      }

      //  保存最新的版本号
      if (res.body.hotVersion) {
        this.storage.set('hotVersion', res.body.hotVersion);
      }

      //
      if (res.body.coldVersion) {
        this.storage.set('coldVersion', res.body.coldVersion);
      }

      //

    }).catch(e => {
      console.log(e);
    });
  }

  initDB() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '初始化数据中...'
      // content: `
      //   <div class="custom-spinner-container">
      //     <div class="custom-spinner-box"></div>
      //   </div>`,
    });
    this.loading.present();
    this.dbService.creatDataBase().then((res) => {
      // resolve(res);
      this.storage.set('HasCreateDb', true);
      this.loading.dismiss();
    }).catch(e => {
      this.loading.dismiss();
      this.toastCtrl.create({
        message: JSON.stringify(e).toString(),
        duration: 1000,
        position: 'middle'
      }).present();
      console.log(e);
      // reject(e);
    });
  }


  // openPage(page) {
  //   // close the menu when clicking a link from the menu
  //   this.menu.close();
  //   // navigate to the new page if it is not the current page
  //   this.nav.setRoot(page.component);
  // }
}
