import { Component } from '@angular/core';
import { DataBaseService } from '../../providers/database/database';
import {Loading, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {SQLiteObject} from "@ionic-native/sqlite";
// import { SQLite } from '@ionic-native/sqlite';
// import { DATABASE_NAME } from '../../common/config';
// import { Platform } from 'ionic-angular';
const tableName = 'ct_product_dtl';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading: Loading ;
  userinfo: any = [];
  total: number = 0;
  constructor(
    private dbService: DataBaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    // private sqlite: SQLite,
    // private sqliteObj: SQLiteObject,
  ) {
    console.log('主页...');
  }
  ionViewDidLoad() {
    // setTimeout(() => {
    //
    // },1000);
    this.storage.get('HasCreateDb').then(res => {
      console.log(res);
      if (res) {
        // this.toastCtrl.create({
        //   message: '查询数据中...',
        //   duration: 2000,
        //   position: 'middle'
        // }).present();
        this.getData();
      } else {
        this.toastCtrl.create({
          message: res.toString(),
          duration: 2000,
          position: 'middle'
        }).present();
      }
    }).catch(e =>{
      this.toastCtrl.create({
        message: `storage: ${e.toString()}`,
        duration: 20000,
        position: 'middle'
      }).present();
      console.log(e);
    });
  }

  getData() {
    let selctLoading = this.loadingCtrl.create({
      content: '查询中...',
    });
    selctLoading.present();
   this.dbService.openDataBase().then((db: SQLiteObject) => {
     db.executeSql(`SELECT * FROM ${tableName}`, {}).then(res => {
       selctLoading.dismiss();
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
    selctLoading.dismiss();

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
