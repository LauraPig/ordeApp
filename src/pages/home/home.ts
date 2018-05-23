import { Component } from '@angular/core';
import { DataBaseService } from '../../providers/database/database';
import {Loading, LoadingController, ToastController, NavController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {SQLite, SQLiteObject, SQLiteTransaction} from "@ionic-native/sqlite";
import { OrderPage } from '../order/order';
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {HttpProvider} from "../../providers/http/http-service";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import * as moment from "moment";
import {DATABASE_NAME} from "../../common/config";
import {resolveDep} from "@angular/core/src/view/provider";
import {resolveTimingValue} from "@angular/animations/browser/src/util";
const tableName = 'ct_product';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  coldVersion: number = 0;
  isFetchCold: boolean = false;
  isFetchHot: boolean = false;
  hotVersion: number = 0;

  orderList: any = [];
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
    public httpDataPro: HttpDataProviders,
    public sqlite: SQLite,
  ) {
    console.log('主页...');
  }
  ionViewDidLoad() {
    // 判断是否已经初始化数据库
    this.storage.get('HasCreateDb').then(res => {
      console.log('res=====>', res);
      if (!res) {
        this.initDB();
      } else if (res) {
        this.handleVersion().then((data) =>{
          alert('data' + data);
          this.getData();
        });
      }
    }).catch(e => {
      console.log(e);
    });
    // setTimeout(() =>{
    //   this.getData();
    // }, 20000);
  }

  handleVersion(): Promise<any> {
    // 获取本地的coldVersion版本号
     return this.storage.get('coldVersion').then(res => {
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
  checkData () : Promise<any>{
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
    let p = new Promise ((resolve, reject) =>{
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
          this.dbService.updateCtMaterialTableData(temData, resolve);
          // this.dbService.updateCtMaterialTableData(temData.ctMaterialList);
        }


      }).catch(e => {
       reject('获取数据错误');
        console.log(e);
        alert('拉取数据错误---' + e.toString());
      });
    });
    return p;
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
      this.handleVersion().then(() =>{
        this.getData();
      });
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

  getData() {
    let today = moment().format('YYYY-MM-DD HH:MM:SS');
    console.log('today', today);
    let params = {
      'userId': '1',
      // 'dinnerDate': today,
      'status': '0',
    }

    this.httpDataPro.fetchUserOrderData(params).then(res =>{
      // alert('res' + JSON.stringify(res));
      if (!res.success) {
        return;
      }
      const list = res.body.ctOrderList;
      if (list && list.length > 0) {
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) =>{
          list.map((item, index) =>{
            let temProductList = item.ctOrderProductList;
            let label = '';
            let num: number = temProductList[0].objNum;
            let name: string = '';
            let officeName: string = '';
            db.executeSql(`SELECT c.label as label from ct_plan a,ct_meal b,sys_dict_value c where a.id= '${item.id}' and a.meal_id = b.id and b.meal_type = c.value`, []).then(res =>{
              // alert('res in select: ' + res.rows.length);
            }).catch(e =>{
              alert('err in select: ' + e.toString());
            });
            // tx.executeSql(`SELECT meal_id FROM ct_plan WHERE id='${item.id}'`, [], (res) =>{
            //   alert('res in select: ' + JSON.stringify(res));
            //
            // }, err =>{
            //   alert('err in select label' + JSON.stringify(err));
            // });

          });
          // db.transaction((tx: SQLiteTransaction) => {
          //
          // }).then().catch(e =>{
          //   alert('err in operate table' + e.toString());
          // });
        }).catch(e =>{
          alert('err in open database' + e.toString());
        });
      }
    }).catch(e => {
      console.log(e);
      alert('网络异常---' + e.toString());
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


  // initDB(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.loading = this.loadingCtrl.create({
  //       spinner: 'bubbles',
  //       content: '初始化数据中...'
  //       // content: `
  //       //   <div class="custom-spinner-container">
  //       //     <div class="custom-spinner-box"></div>
  //       //   </div>`,
  //     });
  //     this.loading.present();
  //     this.dbService.creatDataBase().then((res) => {
  //       resolve(res);
  //       this.loading.dismiss();
  //     }).catch(e => {
  //       this.loading.dismiss();
  //       this.toastCtrl.create({
  //         message: JSON.stringify(e).toString(),
  //         duration: 15000,
  //         position: 'middle'
  //       }).present();
  //       console.log(e);
  //       reject(e);
  //     });
  //   });
  // }
}
