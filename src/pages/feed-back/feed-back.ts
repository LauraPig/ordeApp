import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
/**
 * Generated class for the FeedBackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'feed-back'
})
@Component({
  selector: 'page-feed-back',
  templateUrl: 'feed-back.html',
})
export class FeedBackPage {

  factoryId: string;
  office: string;
  mobile: string;
  phone: string;
  user: string;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public storage: Storage,
      public httpDataService: HttpDataProviders,
    ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedBackPage');
  }

  ionViewWillEnter() {
    this.storage.get('factoryId').then(res =>{
      if(res) {
        this.factoryId = res;
        this.fetchInitInfo(res);
      }
    });

  }

  fetchInitInfo (id: string) {
    if (id) {
      let params = {
        'factoryId': id
      };
      this.httpDataService.fetchFeedBackInfo(params).then(res =>{
        alert(JSON.stringify(res));
        if (res && res.success) {
          if (res.body && res.body.data) {
            let temData = res.body.data || '--';
            this.office = temData.office || '--';
            this.mobile = temData.mobile || '--';
            this.phone = temData.phone || '--';
            this.user = temData.user || '--';
          }
        }
      }).catch(e =>{
        console.log(e);
      });
    }
  }

}
