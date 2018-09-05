import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {DataBaseService} from "../../providers/database/database";
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {SQLiteObject} from "@ionic-native/sqlite";
import {LoginPage} from "../login/login";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CommonHelper} from "../../providers/common-helper";
import {TranslateService} from "ng2-translate";

/**
 * Generated class for the DetailModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'modal-detail'
})
@Component({
  selector: 'page-detail-modal',
  templateUrl: 'detail-modal.html',
  animations: [
    trigger('scroll', [
      state('scrolling', style({opacity: '0', overflow: 'hidden'})),
      state('static', style({opacity: '1',height: '*'})),
      transition('static <=> scrolling', animate('10ms ease-in-out')),
    ]),
  ]
})
export class DetailModalPage {

  item: object;
  dateStr: string; //用餐日期
  officeId: string; // 餐厅ID
  factoryId: string; // 工厂ID
  value: string; // 餐别
  planId: string; //

  status: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public translate: TranslateService,
    public commonHelper: CommonHelper,
    public httpDataPro: HttpDataProviders,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public dbService: DataBaseService,
    public viewCtrl: ViewController,
  ) {
    this.item = this.navParams.get('item');
    this.dateStr = this.navParams.get('todayStr');
    this.officeId = this.navParams.get('id');
    this.value = this.navParams.get('value');
    this.storage.get('factoryId').then(res =>{
      if (res) {
        this.factoryId = res;
      }
    });
  }

  ionViewDidLoad() {

    this.status = 'static';

    if (this.officeId && this.value && this.dateStr) {
      // alert('officeId-->' + this.officeId);
      // alert('value-->' + this.value);
      // alert('dateStr-->' + this.dateStr);

      // alert('-dateStr--' + this.dateStr);
      this.dbService.openDataBase().then((db: SQLiteObject) =>{
        let sqlStr = `select a.id id from ct_plan a,ct_meal b where a.meal_id = b.id and b.office_id = '${this.officeId}' and b.meal_type = '${this.value}' and a.del_flag='0' AND b.del_flag ='0' and a.start_date<='${this.dateStr}' AND a.end_date>='${this.dateStr}'`;
        db.executeSql(sqlStr, {}).then(res =>{
          // alert('res-length--' + res.rows.length);
          if (res.rows.length) {
            this.planId = res.rows.item(0).id;
          }
        }).catch(e => {
          // alert('错误-->' + JSON.stringify(e));
        });
      }).catch(e =>{
        console.log(e);
      })
    }
    console.log('ionViewDidLoad DetailModalPage');
  }


  //订餐按钮
  orderProduct(id: string) {

    if (this.value === 'waterBar') {

      this.translate.get('DETAIL.ORDER_BTN_TIPS').subscribe(res =>{
        // this.commonHelper.Alert(res.toString());
        this.commonHelper.AlertWithInput(res.TITLE,[
          {
            name: 'num',
            type: 'number'
          }
        ], ()=>{}, res.CANCEL_BTN_TEXT, this.handleOrderWaterBar, res.OK_BTN_TEXT, id );
      });

    } else {

      this.translate.get('COMMON.LOADING_TIPS').subscribe(res =>{
        this.commonHelper.LoadingShow(res)
      });

      if (id && this.planId && this.factoryId && this.officeId && this.dateStr) {
        let params = {
          'factoryId': this.factoryId,
          'officeId': this.officeId,
          'planId': this.planId,
          'dinnerDate': this.dateStr,
          'isPre': 1,
          'mealType': this.value,
          'ctOrderProductList': [{'objNum': 1, 'objId': id }],
        };
        this.httpDataPro.createOrder(params).then(data => {
          if (data.success) {
            this.commonHelper.LoadingHide();


            this.translate.get('COMMON.ORDER_SUCCESS_TIPS').subscribe(res =>{
              this.commonHelper.Alert(res.CONTENT,() =>{
                this.navCtrl.setRoot(WaitingUsePage);
              }, res.TITLE, res.BTN_TEXT);
            });

          }  else if (data.errorCode === '-2') {
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
          } else {
            this.commonHelper.LoadingHide();

            this.translate.get('COMMON.ORDER_FAIL_TIPS').subscribe(res =>{
              this.commonHelper.Alert(data.msg,null, res.TITLE, res.BTN_TEXT);
            });
          }
        });
      } else {
        this.commonHelper.LoadingHide();
      }
    }

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }


  // 确定按钮处理方法
  handleOrderWaterBar = (id?, inputData?) => {

    // alert('InputData-->' + inputData.num);
    // console.log('data');

    // this.commonHelper.Alert(`id: ${id} , num: ${inputData && inputData.num}`);


    this.translate.get('COMMON.LOADING_TIPS').subscribe(res =>{
      this.commonHelper.LoadingShow(res)
    });

    if (id && this.planId && this.factoryId && this.officeId && this.dateStr) {
      let params = {
        'factoryId': this.factoryId,
        'officeId': this.officeId,
        'planId': this.planId,
        'dinnerDate': this.dateStr,
        'isPre': 1,
        'mealType': this.value,
        'ctOrderProductList': [{'objNum': inputData.num, 'objId': id }],
      };
      this.httpDataPro.createOrder(params).then(data => {
        if (data.success) {
          this.commonHelper.LoadingHide();


          this.translate.get('COMMON.ORDER_SUCCESS_TIPS').subscribe(res =>{
            this.commonHelper.Alert(res.CONTENT,() =>{
              this.navCtrl.setRoot(WaitingUsePage);
            }, res.TITLE, res.BTN_TEXT);
          });

        }  else if (data.errorCode === '-2') {
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
        } else {
          this.commonHelper.LoadingHide();

          this.translate.get('COMMON.ORDER_FAIL_TIPS').subscribe(res =>{
            this.commonHelper.Alert(res.TITLE,null, data.msg, res.BTN_TEXT);
          });
        }
      });

      // this.alertCtrl.create({
      //   title: '订餐成功',
      //   subTitle: '请到“待消费”列表查看详情',
      //   buttons: [
      //     {
      //       text: '确定',
      //       handler: data => {
      //         // this.navCtrl.setRoot()
      //       }
      //     }
      //   ]
      // }).present();
    } else {
      this.commonHelper.LoadingHide();
      // alert('id-->' + id);
      // alert('planId-->' + this.planId);
      // alert('factoryId-->' + this.factoryId);
      // alert('officeId-->' + this.officeId);
      // alert('dateStr-->' + this.dateStr);
    }
  };


  // 滚动开始
  scrollStart (event: Event) {
    // alert('scroll Start');
    // this.status = this.status === 'static'? 'scrolling': 'static';
    this.status = 'scrolling';
  }


  // 滚动结束
  scrollComplete(event: Event) {
    // alert('scrollEnd');
    // this.status = this.status === 'scroll'? 'static': 'scrolling';
    this.status = 'static';
  }

}
