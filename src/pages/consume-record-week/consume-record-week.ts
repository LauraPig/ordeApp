import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from '@ionic/storage';
import {LoginPage} from "../login/login";
import {getCurrentMonth} from "../../utils/index";
import {CommonHelper} from "../../providers/common-helper";
import {TranslateService} from "ng2-translate";

/**
 * Author：Jimmy Liang
 * Date: 2018-9-14
 * 本月
 */

@IonicPage({
  name: 'consume-record-week'
})
@Component({
  selector: 'page-consume-record-week',
  templateUrl: 'consume-record-week.html',
})
export class ConsumeRecordWeekPage {

  orderList: Array<any> = [];
  isNull: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonHelper: CommonHelper,
    public translate: TranslateService,
    public storage: Storage,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public httpDataPro: HttpDataProviders,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsumeRecordWeekPage');
  }

  ionViewWillEnter() {
    this.orderList = [];
    // let weekOfday = Number(moment().format('E'));//计算今天是这周第几天
    //
    // let lastMonday = `${moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')} 00:00:00`;   //周一日期
    // let lastSunday = `${moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD')} 23:59:59`;   //周日日期

    let month = new Date().getMonth() + 1;
    const [startTime, ] = getCurrentMonth(month);
    let endTime = moment().format('YYYY-MM-DD HH:mm:ss');

    this.getListData(startTime, endTime);
  }

  ionViewDidEnter() {
    this.isNull = this.orderList.length === 0;
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
        // alert('res--in-consume-week-->' + JSON.stringify(res));

        if (res.success) {

          this.orderList = res.body.ctOrderList && res.body.ctOrderList.map((item, index) => {
            item.payDate = moment(item.payDate).format('MM月DD日 HH:mm');
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
  // 显示详情
  gotoRecordDetail(item: any) {
    let temObj = {...item};
    temObj.imgMainUrl = item.blobPath;
    if (item) {
      this.showDetailModal(item.type === '1' ? this.commonHelper.getProductDetailInfoByID(item) : temObj);
    }
  }

  // 弹出详情框
  showDetailModal (p: any) {
    let detailModal = this.modalCtrl.create('modal-detail',{
      item: p,
      id: '',
      value: '',
      isShow: true,
      todayStr: ''
    });
    detailModal.present();
  }


}
