import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DataBaseService} from "../../providers/database/database";
import {SQLiteObject} from "@ionic-native/sqlite";

/**
 * Generated class for the TypeDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'type-detail'
})
@Component({
  selector: 'page-type-detail',
  templateUrl: 'type-detail.html',
})
export class TypeDetailPage {
  name: string;
  value: string;
  label: string;
  officeId: string;
  factoryId: string;
  monStr: string;
  dayStr: string;
  dateStr: string;
  factoryName: string;
  resultList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dbService: DataBaseService,
  ) {
    this.name = navParams.get('name');
    this.value = navParams.get('value');
    this.label = navParams.get('label');
    this.officeId = navParams.get('id');
    this.factoryId = navParams.get('factoryId');
    this.monStr = navParams.get('monStr');
    this.dayStr = navParams.get('dayStr');
    this.factoryName = navParams.get('factoryName');
  }

  ionViewDidLoad() {
    if (this.monStr && this.dayStr && this.value && this.officeId) {
      let yearStr = new Date().getFullYear();
      // this.dateStr = `${yearStr}-${this.monStr}-${this.dayStr}`;


      this.dateStr = `${yearStr}-${this.monStr}-${this.dayStr} 00:00:00`;
      alert('date-' + this.dateStr);
      // AND a.start_date <= '${this.dateStr}' AND a.end_date >= '${this.dateStr}'


      this.dbService.openDataBase().then((db: SQLiteObject) =>{
        db.executeSql(`select d.product_name name,d.price price,d.id id,0 type from ct_plan a ,ct_plan_dtl c,ct_meal b,ct_product d
                       WHERE   c.plan_id = a.id and a.meal_id = b.id AND b.meal_type = '${this.value}' 
                       and b.office_id = '${this.officeId}' AND c.obj_type = '0' AND c.obj_id = d.id
                       and a.del_flag='0' and b.del_flag='0' and c.del_flag='0' and d.del_flag='0'
                       UNION
                       select d.product_set_name name,d.price price,d.id id,1 type  from ct_plan a ,ct_plan_dtl c,ct_meal b,ct_product_set d
                       WHERE   c.plan_id = a.id and a.meal_id = b.id AND b.meal_type = '${this.value}' 
                       and b.office_id = '${this.officeId}' AND c.obj_type = '1' AND c.obj_id = d.id
                       and a.del_flag='0' and b.del_flag='0' and c.del_flag='0' and d.del_flag='0'`,{}).then(res =>{

                         // alert('res.length--' + res.rows.length);
                        if (res.rows.length) {
                          for (let i = 0; i < res.rows.length; i ++) {
                            if (res.rows.item(i).type === 1) {
                              let productName: string ='';
                              let productNameList: Array<any> =[];
                              db.executeSql(`select c.product_name productName from ct_product_set_dtl b,ct_product c where b.product_id = c.id and b.del_flag='0' and c.del_flag='0' AND b.product_set_id= '${res.rows.item(i).id}';`, {}).then(data =>{
                                // alert('data.length--' + data.rows.length);
                                if (data.rows.length) {
                                  for (let j = 0; j < data.rows.length; j ++ ) {
                                    productNameList.push(data.rows.item(j).productName);
                                  }
                                  let temObj = {
                                    imgUrl: 'assets/imgs/bf.jpg',
                                    name: res.rows.item(i).name,
                                    type: res.rows.item(i).type,
                                    price: res.rows.item(i).price,
                                    id: res.rows.item(i).id,
                                    productName: productNameList.join(',')
                                  };
                                  this.resultList.push(temObj);

                                }
                              }).catch(e =>{

                              });
                            } else {
                              let obj = {
                                imgUrl: 'assets/imgs/bf.jpg',
                                name: res.rows.item(i).name,
                                type: res.rows.item(i).type,
                                price: res.rows.item(i).price,
                                id: res.rows.item(i).id,
                                productName: res.rows.item(i).name
                              };
                              this.resultList.push(obj);
                            }
                          }
                        }
        }).catch(e =>{

        });
      }).catch(e =>{

      });
    }
    console.log('ionViewDidLoad TypeDetailPage');
  }

  gotoDetail(item: object) {
    this.navCtrl.push('detail', {
      item,
      dateStr: this.dateStr,
      officeId: this.officeId,
      factoryId: this.factoryId,
      value: this.value,
    });
  }

}
