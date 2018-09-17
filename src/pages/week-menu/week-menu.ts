import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {getResult} from "../../utils/index";
import {DataBaseService} from "../../providers/database/database";
import {SQLiteObject} from "@ionic-native/sqlite";
import {Storage} from "@ionic/storage";
import * as moment from "moment";

/**
 * Generated class for the WeekMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-week-menu',
  templateUrl: 'week-menu.html',
})
export class WeekMenuPage {

  productList: any = [];
  result: number;
  typeList: Array<any> = [];
  factoryId: string;
  factoryName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dbService: DataBaseService,
    public storage: Storage,
  ) {
    // this.productList = productList;
  }

  ionViewDidLoad() {
    this.storage.get('factoryName').then(res => {
      if (res) {
        this.factoryName = res;
      }
    });
    this.result = getResult();
    console.log('显示多少天--', this.result);
    this.storage.get('factoryId').then(res => {
      if (res) {
        this.factoryId = res;
        this.getItemData(res).then(() =>{
          let i = 0;
          while(this.result) {
            let monStr = moment().add(Number(i),'days').format('MM');
            let dayStr = moment().add(Number(i),'days').format('DD');
            let todayStr = `${moment().add(Number(i),'days').format('MM月DD日')}   星期${"日一二三四五六".charAt(Number(moment().add(Number(i),'days').format('d')))}`;
            let tempObj = {
              monStr,
              dayStr,
              todayStr,
              list: this.typeList
            };
            this.productList.push(tempObj);
            this.result--;
            i++;
          }
        });

      }

    });
  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }

  goSettingPage() {
    this.navCtrl.push('setting');
  }

  gotoMenuType(value: string, todayStr: string, typeList: Array<any>, monStr: string, dayStr: string) {
    this.navCtrl.push('WeekMenuType', {
      value,
      factoryName: this.factoryName,
      factoryId: this.factoryId,
      todayStr,
      typeList,
      monStr,
      dayStr,
    })
  }

  getItemData (res): Promise<any> {
   return this.dbService.openDataBase().then((db: SQLiteObject) =>{
      db.executeSql(`select  b.label as label,b.value as value from ct_meal a,sys_dict_value b,sys_office c where c.parent_ids LIKE '%${res}%' AND c.type='4'  AND b.[value]=a.meal_type and a.office_id = c.id AND a.del_flag='0' AND b.del_flag='0' AND c.del_flag = '0' GROUP BY b.label,b.[value],b.sort ORDER BY b.sort;`, {}).then(res =>{
        // alert('res.length' + res.rows.length);
        if (res.rows.length) {
          for ( let i = 0; i < res.rows.length; i++) {
            this.typeList.push({
              label: res.rows.item(i).label,
              imgUrl: 'assets/imgs/bf.jpg',
              value: res.rows.item(i).value,
            });
          }
        }
      }).catch(e =>{
        console.log(e);
      });
    });

  }




}
