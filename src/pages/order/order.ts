import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {CalendarComponentOptions, DayConfig} from 'ion2-calendar'
import * as moment from 'moment'

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
  dayStr: string;
  date: string;
  days: DayConfig[] = [];
  status: boolean = false;
  isToday: boolean = true;

  calendarOptions: CalendarComponentOptions = {
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.monStr = (new Date().getMonth() + 1).toString();
    this.dayStr = (new Date().getDate()).toString();
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

    console.log('ionViewDidLoad OrderPage');
  }

  onChange($event) {
    console.log($event);
    const result = moment().format('YYYY-MM-DD');
    // const today = moment().format('YYYY-MM-DD');
    console.log(result);
    this.isToday = $event.toString() === result;
    this.monStr = (moment($event).get('months') + 1).toString();
    this.dayStr = (moment($event).get('date')).toString();
    this.selectDay = moment($event).format('YYYY年MM月DD');
    // this.getGoalDay();
  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }

  goSettingPage() {
    this.navCtrl.push('setting');
  }

}
