import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {DataBaseService} from "../../providers/database/database";
import {SQLiteObject} from "@ionic-native/sqlite";
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {WaitingUsePage} from "../waiting-use/waiting-use";

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'detail'
})
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  // id: string;
  // type: string;
  item: object;
  dateStr: string; //用餐日期
  officeId: string; // 餐厅ID
  factoryId: string; // 工厂ID
  value: string; // 餐别
  planId: string; //


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public dbService: DataBaseService,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
  ) {
    this.item = this.navParams.get('item');
    this.dateStr = this.navParams.get('dateStr');
    // this.dateStr = '2018-5-28 00:00:00';
    this.officeId = this.navParams.get('officeId');
    this.factoryId = this.navParams.get('factoryId');
    this.value = this.navParams.get('value');

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
  }

  orderProduct(id: string) {
    if (id && this.planId && this.factoryId && this.officeId && this.dateStr) {
      let params = {
        'factoryId': this.factoryId,
        'officeId': this.officeId,
        'planId': this.planId,
        'dinnerDate': this.dateStr,
        'isPre': 1,
        'ctOrderProductList': [{'objNum': 1, 'objId': id }],
      };
      this.httpDataPro.createOrder(params).then(res => {
        if (res.success) {
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
        } else {
          alert(res.msg);
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
      // alert('id-->' + id);
      // alert('planId-->' + this.planId);
      // alert('factoryId-->' + this.factoryId);
      // alert('officeId-->' + this.officeId);
      // alert('dateStr-->' + this.dateStr);
    }
  }

}
