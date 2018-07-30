import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the IntegralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-integral',
  templateUrl: 'integral.html',
})
export class IntegralPage {

  page1: any = "integral-month";
  page2: any = "integral-two-month";
  page3: any = "integral-three-month";
  selectedTabIndex: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntegralPage');
  }

}
