import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LawsRegulationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'laws-regulations'
})
@Component({
  selector: 'page-laws-regulations',
  templateUrl: 'laws-regulations.html',
})
export class LawsRegulationsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LawsRegulationsPage');
  }

}
