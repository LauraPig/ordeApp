import { Component } from '@angular/core';
import { DataBaseService } from '../../providers/database/database';
import {Loading, LoadingController, ToastController, NavController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {SQLiteObject} from "@ionic-native/sqlite";
import { OrderPage } from '../order/order';
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {HttpProvider} from "../../providers/http/http-service";
// import { SQLite } from '@ionic-native/sqlite';
// import { DATABASE_NAME } from '../../common/config';
// import { Platform } from 'ionic-angular';
// const tableName = 'ct_product_dtl';
const tableName = 'ct_product';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading: Loading ;
  userinfo: any = [];
  total: number = 0;
  text: any;
  constructor(
    private dbService: DataBaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private navCtrl: NavController,
    public httpPro: HttpProvider,
    // private sqlite: SQLite,
    // private sqliteObj: SQLiteObject,
  ) {
    console.log('主页...');
  }
  ionViewDidLoad() {

    let initLoading = this.loadingCtrl.create({
      content: '查询数据中...',
    });
    initLoading.present();
    setTimeout(() => {
      this.storage.get('HasCreateDb').then(res => {
        console.log(res);
        if (res) {
          // this.toastCtrl.create({
          //   message: '查询数据中...',
          //   duration: 2000,
          //   position: 'middle'
          // }).present();
          // this.getData(initLoading);
          this.getText(initLoading);
          initLoading.dismiss();
        } else {
          this.toastCtrl.create({
            message: res.toString(),
            duration: 2000,
            position: 'middle'
          }).present();
        }
      }).catch(e =>{
        initLoading.dismiss();
        // this.toastCtrl.create({
        //   message: `storage: ${e.toString()}`,
        //   duration: 20000,
        //   position: 'middle'
        // }).present();
        console.log(e);
      });
    },600);
  }

  getData(initLoading: any) {
    // let selctLoading = this.loadingCtrl.create({
    //   content: '查询中...',
    // });
    // selctLoading.present();
   this.dbService.openDataBase().then((db: SQLiteObject) => {
     db.executeSql(`SELECT * FROM ${tableName}`, {}).then(res => {
       initLoading.dismiss();
       // selctLoading.dismiss();
       if (res.rows.length) {
         this.userinfo = [];
         for(var i=0; i < res.rows.length; i++) {
           this.userinfo.push({
             id:res.rows.item(i).id,
             product_id:res.rows.item(i).product_id,
             material_id:res.rows.item(i).material_id,
             weight:res.rows.item(i).weight
           })
         }
       }
     }).catch(e => {console.log(e)});
     initLoading.dismiss();
    // selctLoading.dismiss();

   }).catch(e => {
    this.toastCtrl.create({
      message: `查询失败: ${e.toString()}`,
      duration: 5000,
      position: 'middle'
    }).present();
    // selctLoading.dismiss();
    console.log(e);
   });

   this.dbService.openDataBase().then((db: SQLiteObject) => {
     db.executeSql(`SELECT COUNT(*) AS total FROM ${tableName}`, {}).then(res => {
       if (res.rows.length) {
         this.total = res.rows.item(0).total;
       }
     }).catch(e => {console.log(e)});
  }).catch(e => {
    // selctLoading.dismiss();
    console.log(e);
  });
  }

  // formatText (a: string) {
  //   a = "" + a;
  //   return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  // }

  getText (initLoading: any) {
    this.dbService.openDataBase().then((db: SQLiteObject) => {
      db.executeSql(`SELECT * FROM ${tableName}`, {}).then(res => {
        initLoading.dismiss();
        // selctLoading.dismiss();
        if (res.rows.length) {
          this.userinfo = [];
          for(var i=0; i < res.rows.length; i++) {
            this.userinfo.push({
              id:res.rows.item(i).id,
              summary:res.rows.item(i).summary
            });

            this.text = res.rows.item(i).summary.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
            let obj = document.querySelector('#text');
            obj.insertAdjacentHTML('afterend', this.text);
          }
        }

      }).catch(e => {console.log(e)});
      initLoading.dismiss();
      // selctLoading.dismiss();

    }).catch(e => {
      this.toastCtrl.create({
        message: `查询失败: ${e.toString()}`,
        duration: 5000,
        position: 'middle'
      }).present();
      initLoading.dismiss();
      // selctLoading.dismiss();
      console.log(e);
    });

    this.dbService.openDataBase().then((db: SQLiteObject) => {
      db.executeSql(`SELECT COUNT(*) AS total FROM ${tableName}`, {}).then(res => {
        if (res.rows.length) {
          this.total = res.rows.item(0).total;
        }
      }).catch(e => {console.log(e)});
    }).catch(e => {
      // selctLoading.dismiss();
      console.log(e);
    });

  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }

  goSettingPage() {
    this.navCtrl.push('setting');
  }

  gotoOrder() {
    this.navCtrl.setRoot(OrderPage);
  }

  gotoWaitingUse() {
    this.navCtrl.setRoot(WaitingUsePage);
  }


  initDB(): Promise<any> {
    return new Promise((resolve, reject) => {
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
        resolve(res);
        this.loading.dismiss();
      }).catch(e => {
        this.loading.dismiss();
        this.toastCtrl.create({
          message: JSON.stringify(e).toString(),
          duration: 15000,
          position: 'middle'
        }).present();
        console.log(e);
        reject(e);
      });
    });
  }
}
