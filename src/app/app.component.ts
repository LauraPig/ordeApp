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

      this.checkData();
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
      const temData = res.body;
      if (!res.success) {
        return;
      }

      //  保存最新的版本号
      if (temData.thermalDataVer) {
        this.storage.set('hotVersion', temData.thermalDataVer);
      }

      //
      if (temData.coldDataVer) {
        this.storage.set('coldVersion', temData.coldDataVer);
      }

      // 处理产品数据
      if (temData.productList && temData.productList.length > 0) {
        temData.productList.map(item => {
          item.createBy = item.createBy.id;
          item.updateBy = item.updateBy.id;
          item.factory = item.factory.id;
          item.office = item.office.id;
        });

        alert(JSON.stringify(temData.productList));
      }

      //
      if (temData.productDtlList && temData.productDtlList.length > 0) {
        temData.productDtlList.map(item => {
          item.product = item.product.id;
          item.material = item.material.id;
        });
      }

      //
      if (temData.productSetList && temData.productSetList.length > 0) {
        temData.productSetList.map(item => {
          item.createBy = item.createBy.id;
          item.updateBy = item.updateBy.id;
          item.factory = item.factory.id;
          item.office = item.office.id;
        });
      }

      //
      if (temData.productSetDtlList && temData.productSetDtlList.length > 0) {
        temData.productSetDtlList.map(item => {
          item.productSet = item.productSet.id;
          item.product = item.product.id;
          item.factory = item.factory.id;
          item.office = item.office.id;
        });
      }

      //
      if (temData.ctMaterialList && temData.ctMaterialList.length > 0) {
        temData.ctMaterialList.map(item => {
          item.office = item.office.id;
        });
      }

      //
      if (temData.dictTypeList && temData.dictTypeList.length > 0) {
        temData.dictTypeList.map(item => {
          item.createBy = item.createBy.id;
          item.updateBy = item.updateBy.id;
        });
      }

      //
      if (temData.dictValueList && temData.dictValueList.length > 0) {
        temData.dictValueList.map(item => {
          item.createBy = item.createBy.id;
          item.updateBy = item.updateBy.id;
          item.dictType = item.dictType.id;
        });
      }


      //
      if (temData.officeList && temData.officeList.length > 0) {
        temData.officeList.map(item => {
          item.createBy = item.createBy.id;
          item.updateBy = item.updateBy.id;
          item.area = item.area.id;
          item.primaryPerson = item.primaryPerson.id;
          item.deputyPerson = item.deputyPerson.id;
        });
      }

      //
      if (temData.ctMealList && temData.ctMealList.length > 0) {
        temData.ctMealList.map(item => {
          item.createBy = item.createBy.id;
          item.updateBy = item.updateBy.id;
          item.factory = item.factory.id;
          item.office = item.office.id;
        });
      }

      //
      if (temData.ctPlanList && temData.ctPlanList.length > 0) {
        temData.ctPlanList.map(item => {
          item.createBy = item.createBy.id;
          item.updateBy = item.updateBy.id;
          item.meal = item.meal.id;
        });
      }

      //
      if (temData.ctPlanDtlList && temData.ctPlanDtlList.length > 0) {
        temData.ctPlanDtlList.map(item => {
          item.plan = item.plan.id;
          item.chef = item.chef.id;
        });
      }

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
