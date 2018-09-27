import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LoginPage} from "../login/login";
import * as moment from 'moment';
import {getCurrentMonth} from "../../utils/index";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import { Storage } from "@ionic/storage";
import {CommonHelper} from "../../providers/common-helper";
import {TranslateService} from "ng2-translate";

/**
 * Generated class for the IntegralMonthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'integral-month'
})
@Component({
  selector: 'page-integral-month',
  templateUrl: 'integral-month.html',
})
export class IntegralMonthPage {

  orderList: Array<any> = [];
  isNull: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpDataPro: HttpDataProviders,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public commonHelper: CommonHelper,
    public translate: TranslateService,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntegralMonthPage');
  }

  ionViewDidEnter() {
    //  判断是否没有数据
    this.isNull = this.orderList.length === 0;
  }

  ionViewWillEnter() {
    this.orderList = [];
    let month = new Date().getMonth() + 1;
    const [startTime, ] = getCurrentMonth(month); //  开始时间
    let endTime = moment().format('YYYY-MM-DD HH:mm:ss'); //  结束时间
    this.getListData(startTime, endTime);

  }

  //  根据时间段获取数据
  getListData(queryStartDate: string, queryEndDate: string ) {

    this.translate.get('COMMON.LOADING_TIPS').subscribe(res =>{
      // this.commonHelper.Alert(res.toString());
      this.commonHelper.LoadingShow(res);
    });

    if (queryEndDate && queryStartDate) {
      let params = {
        'startTime': queryStartDate,
        'endTime': queryEndDate,
      };
      this.httpDataPro.getIntegralDetail(params).then(res =>{
        this.commonHelper.LoadingHide();
        if (res.success) {
          this.orderList = res.body.list || [];
          this.isNull = this.orderList.length === 0;
        } else if (res.errorCode === '-2') {

          // 登录信息过期
          this.translate.get('COMMON.LOGIN_INVALID').subscribe(res =>{
            console.log(res);
            this.commonHelper.Alert(res.CONTENT,null, res.TITLE, res.BTN_TEXT);
          });

          this.storage.remove('token').then(data => {
            console.log(data);
            this.navCtrl.setRoot(LoginPage);
          });
        }
      }).catch(e =>{
        this.commonHelper.LoadingHide();
      });
    } else {
      this.commonHelper.LoadingHide();
    }

  }

}
