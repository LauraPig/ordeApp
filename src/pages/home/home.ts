import { Component } from '@angular/core';
import { OperateDataBaseService } from '../../providers/database/operate-database';
import { DataBaseService } from '../../providers/database/database';
import {Loading, LoadingController, ToastController, NavController, Platform, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {SQLite, SQLiteObject, SQLiteTransaction} from "@ionic-native/sqlite";
import { OrderPage } from '../order/order';
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {HttpProvider} from "../../providers/http/http-service";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import * as moment from "moment";
import {DATABASE_NAME} from "../../common/config";
import {BackButtonService} from "../../providers/back-button/back-button.service";
import {LoginPage} from "../login/login";
import {CommonHelper} from "../../providers/common-helper";
const tableName = 'ct_product';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  coldVersion: number = 0;
  hotVersion: number = 0;
  factoryName: string = '';
  factoryId: string = '';
  initUpdateLoading: any;

  isNull: boolean = false;

  orderList: any = [];
  loading: Loading ;
  userinfo: any = [];
  total: number = 0;
  messageCount: number = 0; // 消息条数
  text: any;
  userName: string; // 用户名称
  constructor(
    private dbService: OperateDataBaseService,
    private dataBaseService: DataBaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private navCtrl: NavController,
    private platform: Platform,
    private backButtonService: BackButtonService,
    public httpPro: HttpProvider,
    public httpDataPro: HttpDataProviders,
    public sqlite: SQLite,
    public alertCtrl: AlertController,
    public commonHelper: CommonHelper,
  ) {

    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction();
    });

    this.storage.get('messageCount').then(res =>{
      if (res) {
        this.messageCount = res;
      }
    });
    console.log('主页...');
  }
  ionViewWillEnter() {
    // this.getHasMessage();

    this.storage.get('messageCount').then(res =>{
      if (res) {
        this.messageCount = res;
      }
    });
    this.storage.get('userName').then(res => {
      if (res) {
        this.userName = res;
      }
    });

    // 判断是否已经初始化数据库
    this.storage.get('HasCreateDb').then(res => {
      console.log('res=====>', res);
      // alert('HasCreateDb=====>' + res);
      if (!res) {
        this.initDB().then((res) => {
          this.handleVersion().then((data) =>{
            // alert('更新数据完成---' + data);
          });
          this.storage.set('HasCreateDb', true);
          this.loading.dismiss();
        });;
      } else if (res) {
        this.handleVersion().then((data) =>{
          // alert('更新数据完成---' + data);
          // this.getData();
        });
      }
    }).catch(e => {
      console.log(e);
    });
    // this.isNull = this.messageList.length === 0;
    // setTimeout(() =>{
    //   this.getData();
    // }, 20000);
  }



  // ionViewWillEnter() {
  //   this.getData();
  //   this.storage.get('messageCount').then(res =>{
  //     if (res) {
  //       this.messageCount = res;
  //     }
  //   });
  //
  // }

  ionViewDidEnter() {
    this.isNull = this.orderList.length === 0;
    console.log('did Enter');
   // this.getData();
  }

  handleVersion(): Promise<any> {
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

       return this.checkData();
      });
    });
     return Promise.reject('错误');
  }

  // 调用接口，拉取最新数据
  checkData () : Promise<any>{
    // alert('res--hotVersion-' + this.hotVersion);
    // alert('res--coldVersion-' + this.coldVersion);
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

   return this.httpDataPro.fetchInitData(params).then(res => {
     this.initUpdateLoading = this.loadingCtrl.create({
       spinner: 'bubbles',
       content: '更新数据中...',
     });
     this.initUpdateLoading.present();
      // alert('结果---' + res.success);
      // alert('数据-in Home--' + JSON.stringify(res));
      // alert('数据---' + JSON.stringify(res.body));
      const temData = res.body;
      // alert('type--' + typeof temData);
      // alert('数据-2--' + JSON.stringify(temData.ctPlanList));
      if (!res.success) {
        this.initUpdateLoading.dismiss();
        if (res.errorCode === '-2') {
          this.alertCtrl.create({
            subTitle: '登录信息失效，请重新登录',
            buttons: [
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
        } else {
          return Promise.reject('获取数据错误');
        }

      }
      //  CT_Material
      // alert(temData.ctMaterialList.length);
     this.dbService.updateCtMaterialTableData(temData).then(() => {
       // alert('1');
       this.dbService.updateCtMealTableData(temData).then(() =>{
         // alert('2');
         this.dbService.updateCtPlanTableData(temData).then(() =>{
           // alert('3');
           this.dbService.updateCtPlanDtlTableData(temData).then(() =>{
             // alert('4');
             this.dbService.updateCtProductTableData(temData).then(() =>{
               // alert('5');
               this.dbService.updateCtProductDtlTableData(temData).then(() =>{
                 // alert('6');
                 this.dbService.updateCtProductSetTableData(temData).then(() =>{
                   // alert('7');
                   this.dbService.updateCtProductSetDtlTableData(temData).then(() =>{
                     // alert('8');
                     this.dbService.updateSysDictTypeTableData(temData).then(() =>{
                       // alert('9');
                       this.dbService.updateSysDictValueTableData(temData).then(() =>{
                         // alert('10');
                         this.dbService.updateSysOfficeTableData(temData).then(() =>{
                           // alert('11');
                           if (temData.thermalDataVer) {
                             // alert('设置缓存hotVersion--' + temData.thermalDataVer);
                             this.storage.set('hotVersion', temData.thermalDataVer);
                           }

                           //
                           if (temData.coldDataVer) {
                             // alert('设置缓存coldVersion--' + temData.coldDataVer);
                             this.storage.set('coldVersion', temData.coldDataVer);
                           }
                           this.initUpdateLoading.dismiss();
                           this.getData();
                         });
                       });
                     });
                   });
                 });
               });
             });
           });
         });
       });
     });
    }).catch(e =>{
     this.initUpdateLoading.dismiss();
      this.alertCtrl.create({
        title: '服务异常，请联系管理员',
        buttons: [{
          text: '确定'
        }]
      }).present();
   });

  }

  initDB() :Promise<any> {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '创建数据库...'
      // content: `
      //   <div class="custom-spinner-container">
      //     <div class="custom-spinner-box"></div>
      //   </div>`,
    });
    // this.loading.present();
     return this.dataBaseService.creatDataBase();
  }


  //  拉取页面数据
  getData() {

    this.orderList = [];

    this.storage.get('factoryId').then(res =>{
      if (!res) {
        this.dbService.openDataBase().then((db: SQLiteObject) =>{
          db.executeSql(`select name, id from sys_office WHERE id = '9a96a9106216453faf44259ee7f98f69'`, {}).then(res =>{
            if (res.rows.length) {
              this.factoryName = res.rows.item(0).name;
              this.factoryId = res.rows.item(0).id;
              this.storage.set('factoryId', this.factoryId);
              this.storage.set('factoryName', this.factoryName);
            }
          }).catch(e =>{
            console.log(e);
          });
        });
      } else {
        this.factoryId = res;
        this.storage.get('factoryName').then(data =>{
          if (data) {
            this.factoryName = data;
          }
        })
      }
    });

    //
    let today = `${moment().format('YYYY-MM-DD')} 00:00:00`;
    console.log('today', today);
    let params = {
      'dinnerDate': today,
      'status': '0',
    }

    // 获取今天已经预定的信息
    this.httpDataPro.fetchUserOrderData(params).then(res =>{
      // alert('res' + JSON.stringify(res));
      if (!res.success && res.errorCode === '-2') {
        this.alertCtrl.create({
          subTitle: '登录信息失效，请重新登录',
          buttons: [
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
      const list = res.body.ctOrderList;
      if (list && list.length > 0) {
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) =>{
          list.map((item, index) =>{
            if (item.factoryId === this.factoryId) {
              let temProductList = item.ctOrderProductList;
              let label = '';
              let num: number = temProductList[0].objNum;
              let productName: string = '';
              let imgUrl: string = 'https://dininghall.blob.core.windows.net/product/1ccd62410d394493ae29be6e83eb3b72.png';
              let officeName: string = '';
              let officeId: string = '';
              let factoryName: string = this.factoryName;

              // 查询餐别
              db.executeSql(`SELECT c.label as label, b.office_id as officeId from ct_plan a,ct_meal b,sys_dict_value c where a.id= '${item.planId}' and a.meal_id = b.id and b.meal_type = c.value and a.del_flag='0' and b.del_flag='0' and c.del_flag='0' `, []).then(res =>{
                if (res.rows.length) {
                  label = res.rows.item(0).label;
                  officeId = res.rows.item(0).officeId;
                  // 查询餐厅名称
                  db.executeSql(`select  name from sys_office where del_flag='0' AND id = '${officeId}'`, []).then(res =>{
                    if (res.rows.length) {
                      officeName = res.rows.item(0).name;
                      // 查询产品名称
                      if (temProductList[0].objType === '0') {
                        db.executeSql(`select product_name as name from ct_product  where del_flag='0' AND id = '${temProductList[0].objId}'`, []).then(res =>{
                          if (res.rows.length) {
                            // alert('item:' + res.rows.item.toString());
                            productName = res.rows.item(0).name;
                            let temObj = {
                              label,
                              imgUrl: temProductList[0].blobPath,
                              productName,
                              num,
                              officeName,
                              factoryName: this.factoryName,
                            };
                            this.orderList.push(temObj);
                          }

                        }).catch(e =>{
                          // alert('err in select ct_product: ' + JSON.stringify(e));
                        });
                      }
                      if (temProductList[0].objType === '1') {
                        db.executeSql(`select product_set_name as name from ct_product_set  where del_flag='0' AND id = '${temProductList[0].objId}'`, []).then(res =>{
                          if (res.rows.length) {
                            productName = res.rows.item(0).name;
                            let temObj = {
                              label,
                              imgUrl: temProductList[0].blobPath,
                              productName,
                              num,
                              officeName,
                              factoryName: this.factoryName,
                            };
                            this.orderList.push(temObj);
                          }

                        }).catch(e =>{
                          // alert('err in select ct_product_set: ' + JSON.stringify(e));
                        });
                      }
                    }

                  }).catch(e =>{
                    // alert('err in select sys_office: ' + JSON.stringify(e));
                  });
                }

              }).catch(e =>{
                // alert('err in select ct_plan: ' + JSON.stringify(e));
              });





              // let temObj = {
              //   label,
              //   imgUrl,
              //   name,
              //   num,
              //   officeName,
              //   factoryName,
              // };
              // this.orderList.push(temObj);



              //
            }
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
          // alert('err in open database' + e.toString());
        });
      }
    }).catch(e => {
      console.log(e);
      // alert('网络异常---' + e.toString());
    });
  }



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
    this.navCtrl.setRoot(OrderPage, {
      factoryId: this.factoryId,
      factoryName: this.factoryName,
    });
  }

  gotoWaitingUse() {
    this.navCtrl.setRoot(WaitingUsePage);
  }

  gotoUnreadMessage() {
    this.navCtrl.push('unread-message');
  }


  gotoHomePage() {
    this.commonHelper.GoBackHomePage();
  }


}
