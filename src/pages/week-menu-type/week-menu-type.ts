import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  item: object = {};
  typeList: object =[];
  currentIndex: number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.get('item');
    this.currentIndex = navParams.get('index');
    console.log(this.item);
    console.log(this.currentIndex);
  }

  ionViewDidLoad() {
    // if (this.itme && this.index) {
    //
    // }
    console.log('ionViewDidLoad WeekMenuTypePage');
  }

  accordion(index: number) {
    this.currentIndex = this.currentIndex === index ? -1 : index ;

  }

}
