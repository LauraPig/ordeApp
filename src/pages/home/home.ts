import { Component } from '@angular/core';
import { OperateDataBaseService } from '../../providers/database/operate-database';
import { DataBaseService } from '../../providers/database/database';
import {Loading, LoadingController, ToastController, NavController, Platform, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import { OrderPage } from '../order/order';
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import * as moment from "moment";
import {DATABASE_NAME} from "../../common/config";
import {LoginPage} from "../login/login";
import {CommonHelper} from "../../providers/common-helper";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  coldVersion: number = 0;
  hotVersion: number = 0;
  factoryName: string = '';
  factoryId: string = '';

  isNull: boolean = false;

  isSYNC: boolean = false;

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
    private translate: TranslateService,
    private navCtrl: NavController,
    public httpDataPro: HttpDataProviders,
    public sqlite: SQLite,
    public alertCtrl: AlertController,
    public commonHelper: CommonHelper,
  ) {
    // this.commonHelper.getHasUnreadMessage();
    console.log('Home Page...');
  }
  ionViewWillEnter() {
    this.commonHelper.getHasUnreadMessage().then(_ => {
      this.storage.get('messageCount').then(res =>{
        if (res) {
          this.messageCount = res;
        } else {
          this.messageCount = 0;
        }
      });
    });


    this.storage.get('userName').then(res => {
      if (res) {
        this.userName = res;
      }
    });

    // 判断是否已经初始化数据库
    this.storage.get('HasCreateDb').then(res => {
      console.log('res=====>', res);
      if (!res) {
        this.initDB().then((res) => {
          this.handleVersion().then((data) =>{
          });
          this.storage.set('HasCreateDb', true);
          this.loading.dismiss();
        });
      } else if (res) {
        this.handleVersion().then((data) =>{
        });
      }
    }).catch(e => {
      console.log(e);
    });
  }

  ionViewDidEnter() {
    this.isNull = this.orderList.length === 0;
    console.log('did Enter');
   // this.getData();
  }

  handleVersion(): Promise<any> {
    // 获取本地的coldVersion版本号
     this.storage.get('coldVersion').then(res => {
      if (res) {
        this.coldVersion = Number(res);
      }
      // hotVersion 版本号
      this.storage.get('hotVersion').then(res => {
        if (res) {
          this.hotVersion = Number(res);
        }

       return this.checkData();
      });
    });
     return Promise.reject('error');
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

     this.translate.get('COMMON.UPDATE_TIPS').subscribe(res =>{
       this.commonHelper.LoadingShow(res);
     });
      const temData = res.body;
      if (!res.success) {
        this.commonHelper.LoadingHide();
        if (res.errorCode === '-2') {
          //  登录信息过期提示
          this.translate.get('COMMON.LOGIN_INVALID').subscribe(res =>{
            console.log(res);
            this.commonHelper.Alert(res.CONTENT,()=>{
              this.storage.remove('token').then(data => {
                console.log(data);

                this.navCtrl.setRoot(LoginPage);
              })
            }, res.TITLE, res.BTN_TEXT);
          });
        } else {
          return Promise.reject('ERROR');
        }

      }

     // 操作数据库表
     this.dbService.updateCtMaterialTableData(temData).then(() => {
       this.dbService.updateCtMealTableData(temData).then(() =>{
         this.dbService.updateCtPlanTableData(temData).then(() =>{
           this.dbService.updateCtPlanDtlTableData(temData).then(() =>{
             this.dbService.updateCtProductTableData(temData).then(() =>{
               this.dbService.updateCtProductDtlTableData(temData).then(() =>{
                 this.dbService.updateCtProductSetTableData(temData).then(() =>{
                   this.dbService.updateCtProductSetDtlTableData(temData).then(() =>{
                     this.dbService.updateSysDictTypeTableData(temData).then(() =>{
                       this.dbService.updateSysDictValueTableData(temData).then(() =>{
                         this.dbService.updateSysOfficeTableData(temData).then(() =>{
                           this.isSYNC = true;
                           if (temData.thermalDataVer) {
                             this.storage.set('hotVersion', temData.thermalDataVer);
                           }
                           if (temData.coldDataVer) {
                             this.storage.set('coldVersion', temData.coldDataVer);
                           }
                           this.commonHelper.LoadingHide();
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
     this.commonHelper.LoadingHide();
     this.translate.get('COMMON.EXCEPTION_TIPS').subscribe(res =>{
       this.commonHelper.Alert(res);
       });
     });

  }


  //  初始化数据库
  initDB() :Promise<any> {
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
      if (!res.success && res.errorCode === '-2') {
        //  登录信息过期提示
        this.translate.get('COMMON.LOGIN_INVALID').subscribe(res =>{
          console.log(res);
          this.commonHelper.Alert(res.CONTENT,()=>{
            this.storage.remove('token').then(data => {
              console.log(data);

              this.navCtrl.setRoot(LoginPage);
            })
          }, res.TITLE, res.BTN_TEXT);
        });
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
              let officeName: string = '';
              let officeId: string = '';

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
                        });
                      }
                    }
                  }).catch(e =>{
                  });
                }
              }).catch(e =>{
              });
            }
          });
        }).catch(e =>{
        });
      }
    }).catch(e => {
      console.log(e);
    });
  }

  //  打开设置菜单
  goSettingPage() {
    this.navCtrl.push('setting');
  }

  //  跳到订餐页面
  gotoOrder() {
    if (this.isSYNC) {
      this.navCtrl.setRoot(OrderPage, {
        factoryId: this.factoryId,
        factoryName: this.factoryName,
      });
    } else {
      this.commonHelper.Toast('加载中，请稍等...','middle', 1000);
    }


  }

  //  待消费列表
  gotoWaitingUse() {
    this.navCtrl.setRoot(WaitingUsePage);
  }


  //  未读消息
  gotoUnreadMessage() {
    this.navCtrl.push('unread-message');
  }


  //  返回主页
  gotoHomePage() {
    this.commonHelper.GoBackHomePage();
  }

  //  二维码
  gotoQRCodePage() {
    this.navCtrl.push('qr-code');
  }


}
