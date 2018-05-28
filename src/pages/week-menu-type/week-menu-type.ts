import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SQLiteObject} from "@ionic-native/sqlite";
import {DataBaseService} from "../../providers/database/database";
import * as moment from "moment";

/**
 * Generated class for the WeekMenuTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'WeekMenuType'
})
@Component({
  selector: 'page-week-menu-type',
  templateUrl: 'week-menu-type.html',
})
export class WeekMenuTypePage {
  value: string; // 餐别类型
  typeList: Array<any> =[];
  factoryName: string;
  factoryId: string;
  monStr: string;
  dayStr: string;
  todayStr: string;
  typeObj: object = {}; //




  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dbService: DataBaseService,
  ) {

    this.value = this.navParams.get('value');
    this.typeList = this.navParams.get('typeList');
    this.factoryName = this.navParams.get('factoryName');
    this.factoryId = this.navParams.get('factoryId');
    this.todayStr = this.navParams.get('todayStr');
    this.dayStr = this.navParams.get('dayStr');
    this.monStr = this.navParams.get('monStr');
  }

  ionViewDidLoad() {
    let testStr = moment(this.todayStr);
    this.getPageData();
  }

  accordion(value: string) {
    this.value =  value === this.value ? '': value ;
    if (this.typeObj[`${this.value}`] && this.typeObj[`${this.value}`].length() > 0) {
      return;
    } else {
      this.getPageData();
    }

  }

  getPageData() {
    let name: string = '';
    let temList: Array<any> = [];
    if (this.value && this.factoryId) {
      // alert('value' + this.value);
      // alert('factoryId' + this.factoryId);
      this.dbService.openDataBase().then((db: SQLiteObject) =>{
        db.executeSql(`select DISTINCT  a.name, a.id from sys_office a ,ct_meal b where  a.parent_ids LIKE '%${this.factoryId}%' AND a.type='4' and b.office_id = a.id and b.meal_type = '${this.value}' AND b.del_flag='0' AND a.del_flag='0';`,{}).then(res =>{
          // alert('res: ' + res.rows.length);
          if (res.rows.length) {
            for (let i =0; i < res.rows.length; i ++ ) {
              name = res.rows.item(i).name;
              temList.push({
                id: res.rows.item(i).id,
                name,
                imgUrl: 'assets/imgs/bf.jpg'
              });
            }

            // alert('temList: ' + temList);
            this.typeObj[`${this.value}`] = temList;
            // alert('result: ' + this.typeObj[`${this.value}`]);
          }
        }).catch(e =>{
          console.log(e);
        })
      }).catch(e =>{
        console.log(e);
      });
    }
  }

  gotoTypeDetail(name: string, value: string, label: string, id: string ) {
    this.navCtrl.push('type-detail', {
      name,
      value,
      label,
      id,
      monStr: this.monStr,
      dayStr: this.dayStr,
      factoryName: this.factoryName,
      factoryId: this.factoryId,
    })
  }

}
