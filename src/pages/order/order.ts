import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {CalendarComponentOptions, DayConfig} from 'ion2-calendar'
import * as moment from 'moment'
import {DataBaseService} from "../../providers/database/database";
import {SQLiteObject} from "@ionic-native/sqlite";
import {SelectTypePage} from "../select-type/select-type";

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  selectDay: any = moment().format('YYYY年MM月DD');
  monStr: string;
  factoryId: string;
  factoryName: string;
  dayStr: string;
  date: string;
  // dateResult: string;
  days: DayConfig[] = [];
  status: boolean = false;
  isToday: boolean = true;
  listLength: number;

  typeList: Array<any> = [];

  calendarOptions: CalendarComponentOptions = {
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public dbService: DataBaseService,
  ) {

    // 获取参数
    this.factoryId = this.navParams.get('factoryId');
    this.factoryName = this.navParams.get('factoryName');


    this.monStr = (new Date().getMonth() + 1).toString();
    this.monStr = this.monStr.length === 1 ? '0' + this.monStr : this.monStr;
    this.dayStr = (new Date().getDate()).toString();
    this.dayStr = this.dayStr.length === 1 ? '0' + this.dayStr : this.dayStr;
    this.days.push({
      date: new Date(),
      title: '今天',
      subTitle: '●',
    });
    this.days.push({
      date: moment().add(1, 'd').toDate(),
      subTitle: '●',
    });
    this.days.push({
      date: moment().add(2, 'd').toDate(),
      subTitle: '●',
    });
    this.calendarOptions = {
      from: new Date(),
      to: moment().add(6, 'd').toDate(),
      pickMode: 'single',
      daysConfig: this.days,
      monthFormat: 'yyyy 年 MM 月 ',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      // defaultDate: new Date(),
      // title: 'test',
    };
  }

  openCalendar() {
    this.status = !this.status;
  }


  ionViewDidLoad() {
    // alert('factoryId--' + this.factoryId);
    if (this.factoryId) {
      this.dbService.openDataBase().then((db: SQLiteObject) =>{
        db.executeSql(`select  b.label as label,b.value as value from ct_meal a,sys_dict_value b,sys_office c where c.parent_ids LIKE '%${this.factoryId}%' AND c.type='4'  AND b.[value]=a.meal_type and a.office_id = c.id AND a.del_flag='0' AND b.del_flag='0' AND c.del_flag = '0' GROUP BY b.label,b.[value],b.sort ORDER BY b.sort;`, {}).then(res =>{
          // alert('res.length' + res.rows.length);
          if (res.rows.length) {
            for ( let i = 0; i < res.rows.length; i++) {
              this.typeList.push({
                label: res.rows.item(i).label,
                imgUrl: `assets/imgs/${res.rows.item(i).value}.png`,
                value: res.rows.item(i).value,
              });


            }
            this.typeList.push(this.typeList[0]);
            // this.typeList.push(this.typeList[0]);
            this.listLength = this.typeList.length;
          }
        }).catch(e =>{
          console.log(e);
        });
      });
    }

    console.log('ionViewDidLoad OrderPage');
  }

  ionViewDidEnter() {
    // const listSelector = document.getElementById('type');
    // alert('count-->' + listSelector.childElementCount);
    // alert('children-->' + listSelector.childNodes[0]);
    // listSelector.children
  }

  onChange($event) {
    console.log($event);
    const result = moment().format('YYYY-MM-DD');
    // const today = moment().format('YYYY-MM-DD');
    console.log(result);
    this.isToday = $event.toString() === result;
    // this.dateResult = $event.toString();
    this.monStr = (moment($event).get('months') + 1).toString();
    this.dayStr = (moment($event).get('date')).toString();
    this.selectDay = moment($event).format('YYYY年MM月DD');
    // this.getGoalDay();
  }

  gotoSelectTypePage(value: string, factoryName: string) {
    // alert('this.monstr--order: ' + this.monStr);
    this.navCtrl.setRoot(SelectTypePage, {
      value,
      factoryName,
      factoryId: this.factoryId,
      monStr: this.monStr,
      dayStr: this.dayStr,
      typeList: this.typeList,
    })
  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }



  goSettingPage() {
    this.navCtrl.push('setting');
  }

}
