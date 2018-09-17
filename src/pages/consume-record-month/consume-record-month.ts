import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import {LoginPage} from "../login/login";
import {getCurrentMonth} from "../../utils/index";
import {CommonHelper} from "../../providers/common-helper";
import {TranslateService} from "ng2-translate";

/**
 * Author：Jimmy Liang
 * Date: 2018-9-14
 * 上个月
 */

@IonicPage({
  name: 'consume-record-month'
})
@Component({
  selector: 'page-consume-record-month',
  templateUrl: 'consume-record-month.html',
})
export class ConsumeRecordMonthPage {

  orderList: Array<any> = [];
  isNull: boolean = false;
  lang: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public commonHelper: CommonHelper,
    public httpDataPro: HttpDataProviders,
  ) {
  }

  ionViewDidLoad() {
    // this.commonHelper.getCurrentLanguage().then(res =>{
    //   if(!res) {
    //     this.lang = 'zh';
    //   } else {
    //     this.lang = res.toString();
    //   }
    //
    // });
    // this.orderList = [];
    // // let weekOfday = Number(moment().format('E'));//计算今天是这周第几天
    // let firstDay = `${moment().format('YYYY-MM')}-01 00:00:00`;   // 开始日期
    // let lastDay = `${moment().format('YYYY-MM-DD HH:MM:SS')}`;   // 今天日期
    // this.getListData(firstDay, lastDay);

    console.log('ionViewDidLoad ConsumeRecordThreeMonthsPage');
  }

  ionViewDidEnter() {
    this.isNull = this.orderList.length === 0;
  }

  ionViewWillEnter() {
    this.orderList = [];
    // let weekOfday = Number(moment().format('E'));//计算今天是这周第几天
    // let firstDay = `${moment().format('YYYY-MM')}-01 00:00:00`;   // 开始日期
    // let lastDay = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;   // 今天日期

    let month = new Date().getMonth();
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
        // this.commonHelper.LoadingHide();
        if (res.success) {
          this.orderList = res.body.ctOrderList && res.body.ctOrderList.map((item, index) => {
              item.payDate = moment(item.payDate).format('MM月DD日 HH:MM');
              return item;
            });
          this.commonHelper.LoadingHide();
        } else if (res.errorCode === '-2') {
          this.commonHelper.LoadingHide();


          //  登录信息过期提示
          this.translate.get('COMMON.LOGIN_INVALID').subscribe(res =>{
            console.log(res);
            this.commonHelper.Alert(res.CONTENT,()=>{
              this.storage.remove('token').then(data => {
                console.log(data);

                this.navCtrl.setRoot(LoginPage);
              })
            }, res.TITLE, res.BTN_TEXT);
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
