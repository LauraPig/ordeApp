import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, LoadingController, Loading, ToastController  } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
// import { DATABASE_NAME } from '../common/config';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataBaseService } from '../providers/database/database';

import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  loading: Loading ;
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
    // public sqliteObj: SQLiteObject,
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: '立即预订', component: HomePage },
      { title: '一周菜单', component: ListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get('HasCreateDb').then(res => {
        console.log('res=====>', res);
        if (!res) {
          this.initDB();
        }
      }).catch(e => {
        console.log(e);
      });
      // this.initDB();
      // this.initDB();
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
