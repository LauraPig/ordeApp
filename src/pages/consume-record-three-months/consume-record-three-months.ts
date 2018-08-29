import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import * as moment from "moment";
import {Storage} from '@ionic/storage';
import {LoginPage} from "../login/login";
import {getCurrentMonth} from "../../utils/index";
import {TranslateService} from "ng2-translate";
import {CommonHelper} from "../../providers/common-helper";
/**
 * Generated class for the ConsumeRecordThreeMonthsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'consume-record-three-months'
})
@Component({
  selector: 'page-consume-record-three-months',
  templateUrl: 'consume-record-three-months.html',
})
export class ConsumeRecordThreeMonthsPage {

  userId: string;
  isNull: boolean = false;
  orderList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public commonHelper: CommonHelper,
    public translate: TranslateService,
    public httpDataPro: HttpDataProviders,
  ) {
  }

  ionViewDidLoad() {



    console.log('ionViewDidLoad ConsumeRecordThreeMonthsPage');
  }

  ionViewDidEnter() {
    this.isNull = this.orderList.length === 0;
  }

  ionViewWillEnter() {
    this.orderList = [];
    // let weekOfday = Number(moment().format('E'));//计算今天是这周第几天
    // let firstDay = `${moment().subtract(89, 'days').format('YYYY-MM-DD')} 00:00:00`;   // 开始日期
    // let lastDay = `${moment().format('YYYY-MM-DD')} 23:59:59`;   // 今天日期

    let month = new Date().getMonth() - 1;
    const [startTime, endTime] = getCurrentMonth(month);
    this.getListData(startTime, endTime);
  }


  getListData(queryStartDate: string, queryEndDate: string ) {

    this.translate.get('COMMON.LOADING_TIPS').subscribe(res =>{
      // this.commonHelper.Alert(res.toString());
      this.commonHelper.LoadingShow(res);
    });

    if (queryEndDate && queryStartDate) {
      let params = {
        'status': '1',
        'queryStartDate': queryStartDate,
        'queryEndDate': queryEndDate,
      };
      this.httpDataPro.fetchRecordListData(params).then(res =>{

        // alert('res-data--' + JSON.stringify(res.body.ctOrderList));
        if (res.success) {
          this.orderList = res.body.ctOrderList && res.body.ctOrderList.map((item, index) => {
              item.payDate = moment(item.payDate).format('MM月DD日 HH:MM');
              return item;
            });
          this.commonHelper.LoadingHide();
        } else if (res.errorCode === '-2') {
          this.commonHelper.LoadingHide();
          // 登录信息过期
          this.translate.get('COMMON.LOGIN_INVALID').subscribe(res =>{
            console.log(res);
            this.commonHelper.Alert(res.CONTENT,null, res.TITLE, res.BTN_TEXT);
          });

          this.storage.remove('token').then(data => {
            console.log(data);
            this.navCtrl.setRoot(LoginPage);
          })
        }

      }).catch(e =>{
        this.commonHelper.LoadingHide();
      });
    } else {
      this.commonHelper.LoadingHide();
    }
  }

}
