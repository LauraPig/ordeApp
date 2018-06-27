import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from '@ionic/storage';
/**
 * Generated class for the MessageDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'message-detail'
})
@Component({
  selector: 'page-message-detail',
  templateUrl: 'message-detail.html',
})
export class MessageDetailPage {
  item: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
  ) {
    this.item = this.navParams.get('item');
  }

  ionViewDidLoad() {
    // alert('ionViewWillLeave');
    let reqDateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    // this.storage.get('token').then(res =>{
    //   if (res) {
    //     this.token = res;
    //   }
    // });
    let params = {
      'pushDate': reqDateStr,
      'flag': '0'
    };
    this.httpDataPro.fetchHasMessage(params).then (res => {
      // alert('res-in-loop->' + JSON.stringify(res));
      if (res.success) {
        this.storage.set('messageCount', res.body.count);
      }
    });
    console.log('ionViewDidLoad MessageDetailPage');
  }

  // ionViewWillLeave () {
  //   // alert('ionViewWillLeave');
  //   let reqDateStr = moment().format('YYYY-MM-DD HH:MM:SS');
  //   // this.storage.get('token').then(res =>{
  //   //   if (res) {
  //   //     this.token = res;
  //   //   }
  //   // });
  //   let params = {
  //     'pushDate': reqDateStr,
  //     'flag': '0'
  //   };
  //   this.httpDataPro.fetchHasMessage(params).then (res => {
  //     // alert('res-in-loop->' + JSON.stringify(res));
  //     if (res.success) {
  //       this.storage.set('messageCount', res.body.count);
  //     }
  //   });
  // }

}
