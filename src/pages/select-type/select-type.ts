import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SelectTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-type',
  templateUrl: 'select-type.html',
})
export class SelectTypePage {

  value: string;
  factoryName: string;
  factoryId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.value = this.navParams.get('value');
    this.factoryName = this.navParams.get('factoryName');
    this.factoryId = this.navParams.get('factoryId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectTypePage');
  }

}
