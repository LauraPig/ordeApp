import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, LoadingController, Loading, ToastController  } from 'ionic-angular';

import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataBaseService } from '../providers/database/database';

import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../providers/http-data/http-data";
import {LoginPage} from "../pages/login/login";


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
      this.storage.set('userId', '1');
      this.storage.get('token').then(res =>{
        // alert('res-->' + res);
        if (res) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = LoginPage;
        }
      });
      // this.storage.set('factoryId', '9a96a9106216453faf44259ee7f98f69');
      // this.storage.set('factoryName', '1');
    });
  }

  handleVersion() {
    // 获取本地的coldVersion版本号
    this.storage.get('coldVersion').then(res => {
      // alert('res--coldVersion-' + res);
      if (res) {
        this.coldVersion = Number(res);
      }
      // hotVersion 版本号
      this.storage.get('hotVersion').then(res => {
        // alert('res--hotVersion-' + res);
        if (res) {
          this.hotVersion = Number(res);
        }

        this.checkData();
      }).catch(e => {
        this.isFetchHot = true;
        console.log(e);
      });
    }).catch(e => {
      this.isFetchCold = true;
      console.log(e);
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
    // alert('this.coldVersion--' + this.coldVersion);
    // alert('this.hotVersion--' + this.hotVersion);
    this.httpDataPro.fetchInitData(params).then(res => {
      // alert('结果---' + res.success);
      // alert('数据---' + JSON.stringify(res.body));
      // alert('数据---' + JSON.stringify(res.body));
      const temData = res.body;
      // alert('type--' + typeof temData);
      // alert('数据-2--' + JSON.stringify(temData.ctPlanList));
      if (!res.success) {
        return;
      }

      //  保存最新的版本号
      if (temData.thermalDataVer && temData.thermalDataVer !== this.hotVersion) {
        // alert('设置缓存hotVersion--' + temData.thermalDataVer);
        // this.storage.set('hotVersion', temData.thermalDataVer);
      }

      //
      if (temData.coldDataVer && temData.coldDataVer !== this.coldVersion) {
        // alert('设置缓存coldVersion--' + temData.coldDataVer);
        // this.storage.set('coldVersion', temData.coldDataVer);
      }

      //  CT_Material
      // alert(temData.ctMaterialList.length);
      if (temData.ctMaterialList && temData.ctMaterialList.length > 0) {
        // this.dbService.updateCtMaterialTableData(temData);
        // this.dbService.updateCtMaterialTableData(temData.ctMaterialList);
      }


    }).catch(e => {
      console.log(e);
      alert('拉取数据错误---' + e.toString());
    });
  }

  initDB() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '创建数据库...'
      // content: `
      //   <div class="custom-spinner-container">
      //     <div class="custom-spinner-box"></div>
      //   </div>`,
    });
    this.loading.present();
    this.dbService.creatDataBase().then((res) => {
      // resolve(res);
      this.handleVersion();
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
