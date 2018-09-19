import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {TranslateService} from "ng2-translate";
import {CommonHelper} from "../../providers/common-helper";
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
      public commonHelper: CommonHelper,
      public translate: TranslateService,
      public loadingCtrl: LoadingController,
      public httpDataService: HttpDataProviders,
    ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedBackPage');
  }

  ionViewWillEnter() {
    //  获取工厂ID
    this.storage.get('factoryId').then(res =>{
      if(res) {
        this.factoryId = res;
        this.fetchInitInfo(res);
      }
    });

  }


  //  根据ID获取初始化信息
  fetchInitInfo (id: string) {
    if (id) {

      this.translate.get('COMMON.LOADING_TIPS').subscribe(res =>{
        this.commonHelper.LoadingShow(res)
      });
      let params = {
        'id': id
      };
      this.httpDataService.fetchFeedBackInfo(params).then(res =>{
        this.commonHelper.LoadingHide();
        // alert(JSON.stringify(res));
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
        this.commonHelper.LoadingHide();
        console.log(e);
      });
    }
  }

  gotoFD() {
    this.navCtrl.push('feed-back-detail');
  }

}
