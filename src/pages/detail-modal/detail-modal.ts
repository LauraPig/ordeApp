import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {DataBaseService} from "../../providers/database/database";
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {SQLiteObject} from "@ionic-native/sqlite";
import {LoginPage} from "../login/login";

/**
 * Generated class for the DetailModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'modal-detail'
})
@Component({
  selector: 'page-detail-modal',
  templateUrl: 'detail-modal.html',
})
export class DetailModalPage {

  item: object;
  dateStr: string; //用餐日期
  officeId: string; // 餐厅ID
  factoryId: string; // 工厂ID
  value: string; // 餐别
  planId: string; //
  userId: string; //

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public dbService: DataBaseService,
    public viewCtrl: ViewController,
  ) {
    this.item = this.navParams.get('item');
    this.dateStr = this.navParams.get('todayStr');
    this.officeId = this.navParams.get('id');
    this.value = this.navParams.get('value');
    this.storage.get('factoryId').then(res =>{
      if (res) {
        this.factoryId = res;
      }
    });
  }

  ionViewDidLoad() {

    if (this.officeId && this.value && this.dateStr) {
      // alert('officeId-->' + this.officeId);
      // alert('value-->' + this.value);
      // alert('dateStr-->' + this.dateStr);

      // alert('-dateStr--' + this.dateStr);
      this.dbService.openDataBase().then((db: SQLiteObject) =>{
        let sqlStr = `select a.id id from ct_plan a,ct_meal b where a.meal_id = b.id and b.office_id = '${this.officeId}' and b.meal_type = '${this.value}' and a.del_flag='0' AND b.del_flag ='0' and a.start_date<='${this.dateStr}' AND a.end_date>='${this.dateStr}'`;
        db.executeSql(sqlStr, {}).then(res =>{
          // alert('res-length--' + res.rows.length);
          if (res.rows.length) {
            this.planId = res.rows.item(0).id;
          }
        }).catch(e => {
          alert('错误-->' + JSON.stringify(e));
        });
      }).catch(e =>{
        console.log(e);
      })
    }
    console.log('ionViewDidLoad DetailModalPage');
  }

  orderProduct(id: string) {

    if (this.value === 'waterBar') {

      let numCtrl = this.alertCtrl.create({
        title: '份数',
        inputs: [
          {
            name: 'num',
            // placeholder: '1',
            type: 'number'
          }
        ],
        buttons: [
          {
            text: '确认',
            handler: inputData => {
              // alert('InputData-->' + inputData.num);
              console.log('data');


              let orderLoading = this.loadingCtrl.create({
                spinner: 'bubbles',
                content: '处理中...'
                // content: `
                //   <div class="custom-spinner-container">
                //     <div class="custom-spinner-box"></div>
                //   </div>`,
              });
              orderLoading.present();

              if (id && this.planId && this.factoryId && this.officeId && this.dateStr) {
                let params = {
                  'factoryId': this.factoryId,
                  'officeId': this.officeId,
                  'planId': this.planId,
                  'dinnerDate': this.dateStr,
                  'isPre': 1,
                  'mealType': this.value,
                  'ctOrderProductList': [{'objNum': 1, 'objId': id }],
                };
                this.httpDataPro.createOrder(params).then(res => {
                  if (res.success) {
                    orderLoading.dismiss().then(() =>{
                      this.alertCtrl.create({
                        title: '订餐成功',
                        subTitle: '请到“待消费”列表查看详情',
                        buttons: [
                          {
                            text: '确定',
                            handler: data => {
                              this.navCtrl.setRoot(WaitingUsePage);
                            }
                          }
                        ]
                      }).present();
                    });

                  }  else if (res.errorCode === '-2') {
                    alert('登录信息过期，请重新登录');
                    this.storage.remove('token').then(data => {
                      console.log(data);
                      this.navCtrl.setRoot(LoginPage);
                    })
                  } else {
                    orderLoading.dismiss().then(() =>{
                      alert(res.msg);
                    });

                  }
                });

                // this.alertCtrl.create({
                //   title: '订餐成功',
                //   subTitle: '请到“待消费”列表查看详情',
                //   buttons: [
                //     {
                //       text: '确定',
                //       handler: data => {
                //         // this.navCtrl.setRoot()
                //       }
                //     }
                //   ]
                // }).present();
              } else {
                orderLoading.dismiss();
                // alert('id-->' + id);
                // alert('planId-->' + this.planId);
                // alert('factoryId-->' + this.factoryId);
                // alert('officeId-->' + this.officeId);
                // alert('dateStr-->' + this.dateStr);
                // alert('userId-->' + this.userId);
              }

            }
          },
          {
            text: '取消',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      numCtrl.present();

    } else {
      let orderLoading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: '处理中...'
        // content: `
        //   <div class="custom-spinner-container">
        //     <div class="custom-spinner-box"></div>
        //   </div>`,
      });
      orderLoading.present();

      if (id && this.planId && this.factoryId && this.officeId && this.dateStr) {
        let params = {
          'factoryId': this.factoryId,
          'officeId': this.officeId,
          'planId': this.planId,
          'dinnerDate': this.dateStr,
          'isPre': 1,
          'mealType': this.value,
          'ctOrderProductList': [{'objNum': 1, 'objId': id }],
        };
        this.httpDataPro.createOrder(params).then(res => {
          if (res.success) {
            orderLoading.dismiss().then(() =>{
              this.alertCtrl.create({
                title: '订餐成功',
                subTitle: '请到“待消费”列表查看详情',
                buttons: [
                  {
                    text: '确定',
                    handler: data => {
                      this.navCtrl.setRoot(WaitingUsePage);
                    }
                  }
                ]
              }).present();
            });

          }  else if (res.errorCode === '-2') {
            orderLoading.dismiss();
            alert('登录信息过期，请重新登录');
            this.storage.remove('token').then(data => {
              console.log(data);
              this.navCtrl.setRoot(LoginPage);
            })
          } else {
            orderLoading.dismiss().then(() =>{
              alert(res.msg);
            });

          }
        });

        // this.alertCtrl.create({
        //   title: '订餐成功',
        //   subTitle: '请到“待消费”列表查看详情',
        //   buttons: [
        //     {
        //       text: '确定',
        //       handler: data => {
        //         // this.navCtrl.setRoot()
        //       }
        //     }
        //   ]
        // }).present();
      } else {
        orderLoading.dismiss();
        // alert('id-->' + id);
        // alert('planId-->' + this.planId);
        // alert('factoryId-->' + this.factoryId);
        // alert('officeId-->' + this.officeId);
        // alert('dateStr-->' + this.dateStr);
        // alert('userId-->' + this.userId);
      }
    }

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
