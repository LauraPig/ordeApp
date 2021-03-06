import {Component, ViewChild} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController, Nav,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CalendarComponentOptions, DayConfig} from 'ion2-calendar'
import * as moment from 'moment'
import {DataBaseService} from "../../providers/database/database";
import {SQLiteObject} from "@ionic-native/sqlite";
import { Storage } from '@ionic/storage';
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {LoginPage} from "../login/login";
import {CommonHelper} from "../../providers/common-helper";

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
  animations: [
    trigger('expand', [
      state('Active', style({opacity: '1',height: '*'})),
      state('NotActive', style({opacity: '0',height: 0, overflow: 'hidden'})),
      transition('Active <=> NotActive', animate('500ms ease-in-out')),
      state('ActiveUp', style({transform: '*'})),
      state('ActiveDown', style({transform: 'rotate(180deg)'})),
      transition('ActiveUp <=> ActiveDown', animate('500ms ease-in-out')),
    ]),
    trigger('expandDetail', [
      state('ActiveDetail', style({opacity: '1',height: '*'})),
      state('NotActiveDetail', style({opacity: '0',height: 0, overflow: 'hidden'})),
      transition('ActiveDetail <=> NotActiveDetail', animate('500ms ease-in-out')),
      state('ActiveDetailUp', style({transform: '*'})),
      state('ActiveDetailDown', style({transform: 'rotate(180deg)'})),
      transition('ActiveDetailUp <=> ActiveDetailDown', animate('500ms ease-in-out')),
    ]),
    trigger('expandDate', [
      state('ActiveDate', style({opacity: '1',height: '*', display: '*', marginTop: '3px'})),
      state('NotActiveDate', style({opacity: '0',height: 0, display: 'none', overflow: 'hidden', marginTop: '0px'})),
      transition('ActiveDate <=> NotActiveDate', animate('500ms ease-in-out')),
      state('ActiveUp', style({transform: '*'})),
      state('ActiveDown', style({transform: 'rotate(180deg)'})),
      transition('ActiveUp <=> ActiveDown', animate('500ms ease-in-out')),
    ])
  ]

})
export class OrderPage {
  selectDay: any = moment().format('MM/DD/YYYY');
  monStr: string;
  factoryId: string;
  factoryName: string;
  dayStr: string;
  date: string;
  days: DayConfig[] = [];
  status: boolean = false; // 控制日期是否显示
  expandDateStatus: string = 'ActiveDown'; // 控制日期箭头状态
  expandStatus: string = 'NotActiveDate'; // 控制日期下拉部分是否显示
  listLength: number;

  typeList: Array<any> = []; // 餐别类型List

  todayStr: string;  // 日期选择器选择的时间 格式： YYYY-MM-DD HH:mm:ss
  planId: string;  // 产品计划ID
  userName: string;  // 当前用户名称
  messageCount: number;  // 消息条数

  isNull: boolean = false;  //是否显示暂无数据

  calendarOptions: CalendarComponentOptions = {
  };


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public commonHelper: CommonHelper,
    public dbService: DataBaseService,
    public httpDataPro: HttpDataProviders,
  ) {

    this.isNull = false;

    // 获取用户名称
    this.storage.get('userName').then(res =>{
      if (res) {
        this.userName = res;
      }
    });
    this.todayStr = moment().format('YYYY-MM-DD');

    this.monStr = (new Date().getMonth() + 1).toString();
    this.monStr = this.monStr.length === 1 ? '0' + this.monStr : this.monStr;
    this.dayStr = (new Date().getDate()).toString();
    this.dayStr = this.dayStr.length === 1 ? '0' + this.dayStr : this.dayStr;
    this.days.push({
      date: new Date(),
      title: '今天',
    });


    this.calendarOptions = {
      from: new Date(),
      to: moment().add(13, 'd').toDate(),
      pickMode: 'single',
      daysConfig: this.days,
      // showMonthPicker: false,
      monthFormat: 'yyyy 年 MM 月 ',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      monthPickerFormat: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

    };
  }

  openCalendar() {
    this.status = !this.status;
    this.expandStatus = this.expandStatus === 'ActiveDate' ? 'NotActiveDate': 'ActiveDate' ;
    this.expandDateStatus = this.expandDateStatus === 'ActiveUp' ? 'ActiveDown': 'ActiveUp' ;
  }


  ionViewWillEnter() {

    this.commonHelper.getHasUnreadMessage().then(_ => {
      this.storage.get('messageCount').then(res =>{
        if (res) {
          this.messageCount = res;
        } else {
          this.messageCount = 0;
        }
      });
    });

    // 获取工厂名称
    this.storage.get('factoryName').then(res =>{
      if (res) {
        this.factoryName = res;
      }
    });


    this.typeList = [];
    // 获取信息条数
    this.storage.get('messageCount').then(res =>{
      if (res) {
        this.messageCount = res;
      }
    });
    // 获取工厂ID
    this.storage.get('factoryId').then(data =>{
      if (data) {
        let dataLoading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: '加载中...',
        });
        dataLoading.present();
        this.factoryId = data;
        // alert('res.length--->' + this.factoryId);
        this.dbService.openDataBase().then((db: SQLiteObject) =>{
          db.executeSql(`select  b.label as label,b.value as value from ct_meal a,sys_dict_value b,sys_office c where c.parent_ids LIKE '%${this.factoryId}%' AND c.type='4'  AND b.[value]=a.meal_type and a.office_id = c.id AND a.del_flag='0' AND b.del_flag='0' AND c.del_flag = '0' GROUP BY b.label,b.[value],b.sort ORDER BY b.sort;`, {}).then(res =>{
            // alert('res.length--->' + res.rows.length);
            // alert('res.length--->' + res.rows.length);
            dataLoading.dismiss();
            if (res.rows.length) {
              for ( let i = 0; i < res.rows.length; i++) {
                this.typeList.push({
                  label: res.rows.item(i).label,
                  imgUrl: `https://dininghall.blob.core.windows.net/product/${res.rows.item(i).value}.png`,
                  value: res.rows.item(i).value,
                  officeList: [],
                  status: 'NotActive',
                  direction: 'ActiveDown',
                });
              }
              this.listLength = this.typeList.length;
            }
          }).catch(e =>{
            dataLoading.dismiss();
            console.log(e);
          });
        });
      }
    });
  }

  ionViewDidEnter() {
    this.isNull = true;
  }

  // 日期选择事件
  onChange($event) {
    this.status = !this.status;
    this.expandStatus = this.expandStatus === 'ActiveDate' ? 'NotActiveDate': 'ActiveDate' ;
    this.expandDateStatus = this.expandDateStatus === 'ActiveUp' ? 'ActiveDown': 'ActiveUp' ;
    console.log($event);
    const result = moment().format('YYYY-MM-DD');
    console.log(result);
    this.monStr = (moment($event).get('months') + 1).toString();
    this.dayStr = (moment($event).get('date')).toString();
    this.selectDay = moment($event).format('MM/DD/YYYY');
    this.todayStr = moment($event).format('YYYY-MM-DD');
  }


  // 获取餐别下的餐厅
  getMealTypeDetail(item: any, index: number) {

    this.typeList.map((item, i) => {
      if (i !== index) {
        item.status = 'NotActive';
        item.direction = 'ActiveDown';
      }
      return item;
    });

    let name: string = '';
    let temList: Array<any> = [];
    if (item.value && this.factoryId) {
      this.dbService.openDataBase().then((db: SQLiteObject) =>{
        db.executeSql(`SELECT DISTINCT a.id ,a.name from sys_office a ,ct_meal b,ct_plan c WHERE a.parent_ids   LIKE '%${this.factoryId}%'  AND a.type='4' 
AND a.id = b.office_id AND b.meal_type = '${item.value}' AND a.del_flag='0' AND b.del_flag='0' AND c.del_flag='0' 
AND c.meal_id = b.id AND c.start_date = '${this.todayStr}' AND c.status='1' 
;`,{}).then(res =>{
          if (res.rows.length) {
            for (let i =0; i < res.rows.length; i ++ ) {
              name = res.rows.item(i).name;
              temList.push({
                id: res.rows.item(i).id,
                name,
                imgUrl: 'https://dininghall.blob.core.windows.net/product/noodle.png',
                status: 'NotActiveDetail', // 展开状态
                direction: 'ActiveDetailDown', // 箭头状态
                productList: [],
              });
            }

            this.typeList[index].status = item.status === 'Active' ? 'NotActive' : 'Active';
            this.typeList[index].direction = item.direction === 'ActiveUp' ? 'ActiveDown' : 'ActiveUp';
            this.typeList[index].officeList = temList;
          } else {
            this.toastCtrl.create({
              message: '暂无数据',
              duration: 1000,
              position: 'middle',
              cssClass: 'toast-ctrl'
            }).present();
          }
        }).catch(e =>{
          console.log(e);
        })
      }).catch(e =>{
        console.log(e);
      });
    }
  }


  // 根据餐厅获取对应的产品列表
  getProductList (item: any, p: any, parentIndex: number, childrenIndex: number) {

    this.typeList[parentIndex].officeList[childrenIndex].status = p.status === 'ActiveDetail' ? 'NotActiveDetail' : 'ActiveDetail';
    this.typeList[parentIndex].officeList[childrenIndex].direction = p.direction === 'ActiveDetailUp' ? 'ActiveDetailDown' : 'ActiveDetailUp';

    let temList: Array<any> = [];
    if (this.todayStr && item.value && p.id) {
      this.dbService.openDataBase().then((db: SQLiteObject) =>{
        db.executeSql(`select d.product_name name,d.price price,d.id id,0 type,d.blob_path imgPath from ct_plan a ,ct_plan_dtl c,ct_meal b,ct_product d
                       WHERE   c.plan_id = a.id and a.meal_id = b.id AND b.meal_type = '${item.value}'
                       and b.office_id = '${p.id}' AND c.obj_type = '0' AND c.obj_id = d.id
                       and a.del_flag='0' and b.del_flag='0' and c.del_flag='0' and d.del_flag='0'
                       and a.start_date<='${this.todayStr}' and a.end_date>='${this.todayStr}'
                       UNION
                       select d.product_set_name name,d.price price,d.id id,1 type,d.blob_path path  from ct_plan a ,ct_plan_dtl c,ct_meal b,ct_product_set d
                       WHERE   c.plan_id = a.id and a.meal_id = b.id AND b.meal_type = '${item.value}'
                       and b.office_id = '${p.id}' AND c.obj_type = '1' AND c.obj_id = d.id
                       and a.del_flag='0' and b.del_flag='0' and c.del_flag='0' and d.del_flag='0'
                       and a.start_date<='${this.todayStr}' and a.end_date>='${this.todayStr}'`,{}).then(res =>{
          if (res.rows.length) {
            for (let i = 0; i < res.rows.length; i ++) {
              if (res.rows.item(i).type === 1) {
                let productNameList: Array<any> = [];
                let blobPathList: Array<any> = [];
                let mealList: Array<any> = [];
                db.executeSql(`select c.product_name productName,c.blob_path blobPath  from ct_product_set_dtl b,ct_product c where b.product_id = c.id and b.del_flag='0' and c.del_flag='0' AND b.product_set_id= '${res.rows.item(i).id}';`, {}).then(data =>{
                  if (data.rows.length) {
                    for (let j = 0; j < data.rows.length; j ++ ) {
                      productNameList.push(data.rows.item(j).productName);
                      blobPathList.push(data.rows.item(j).blobPath);
                      let productObj = {
                        picUrl:  data.rows.item(j).blobPath,
                        name:  data.rows.item(j).productName,
                      };
                      mealList.push(productObj);
                    }
                    let temObj = {
                      imgUrl: blobPathList,
                      imgMainUrl: res.rows.item(i).imgPath,
                      name: res.rows.item(i).name,
                      type: res.rows.item(i).type,
                      price: res.rows.item(i).price,
                      id: res.rows.item(i).id,
                      productName: productNameList.join(','),
                      productObjList: mealList,  // 套餐下的产品对象
                    };
                    temList.push(temObj);
                  }
                }).catch(e =>{

                });
              } else {
                let singleProduct: Array<any> =[];
                singleProduct.push(res.rows.item(i).imgPath);
                let obj = {
                  imgUrl: singleProduct,
                  imgMainUrl: res.rows.item(i).imgPath,
                  name: res.rows.item(i).name,
                  type: res.rows.item(i).type,
                  price: res.rows.item(i).price,
                  id: res.rows.item(i).id,
                  productName: res.rows.item(i).name
                };
                temList.push(obj);
              }
              this.typeList[parentIndex].officeList[childrenIndex].productList = temList;
            }

          } else {
            this.toastCtrl.create({
              message: '暂无数据',
              duration: 1000,
              position: 'middle',
              cssClass: 'toast-ctrl'
            }).present();
          }
        }).catch(e =>{

        });
      }).catch(e =>{

      });
    }
  }



  // 弹出详情框
  showDetailModal (p: any, id: string, value: string) {
    let detailModal = this.modalCtrl.create('modal-detail',{
      item: p,
      id,
      value,
      isShow: false,
      todayStr: this.todayStr
    });
    detailModal.present();
  }

  //  订餐按钮
  doOrder(e: Event, de: any, officeId: string, value: string) {

    e.stopPropagation(); //阻止事件冒泡

    //判断是否水吧
    if (value === 'waterBar') {
      let numCtrl = this.alertCtrl.create({
        title: '份数',
        inputs: [
          {
            name: 'num',
            type: 'number'
          }
        ],
        buttons: [
          {
            text: '确认',
            handler: inputData => {
              console.log('data');
              if (inputData.num) {

              }


              let orderLoading = this.loadingCtrl.create({
                spinner: 'bubbles',
                content: '处理中...'
              });
              orderLoading.present();

              if (officeId && value && this.todayStr) {
                this.dbService.openDataBase().then((db: SQLiteObject) =>{
                  let sqlStr = `select a.id id from ct_plan a,ct_meal b where a.meal_id = b.id and b.office_id = '${officeId}' and b.meal_type = '${value}' and a.del_flag='0' AND b.del_flag ='0' and a.start_date<='${this.todayStr}' AND a.end_date>='${this.todayStr}'`;
                  db.executeSql(sqlStr, {}).then(res =>{
                    if (res.rows.length) {
                      this.planId = res.rows.item(0).id;

                      //下单操作
                      if (de.id && this.planId && this.factoryId && officeId && this.todayStr) {
                        let params = {
                          'factoryId': this.factoryId,
                          'officeId': officeId,
                          'planId': this.planId,
                          'dinnerDate': this.todayStr,
                          'isPre': 1,
                          'mealType': value,
                          'ctOrderProductList': [{'objNum': inputData.num, 'objId': de.id }],
                        };
                        this.httpDataPro.createOrder(params).then(res => {
                          if (res.success) {
                            orderLoading.dismiss().then(() =>{
                              this.alertCtrl.create({
                                title: '订餐成功',
                                subTitle: '请到“待消费”列表查看详情',
                                buttons: [
                                  {
                                    text: '确定',
                                    handler: data => {
                                      this.navCtrl.setRoot(WaitingUsePage);
                                    }
                                  }
                                ]
                              }).present();
                            });
                          } else if (res.errorCode === '-2') {
                            orderLoading.dismiss();
                            this.alertCtrl.create({
                              subTitle: '登录信息失效，请重新登录',
                              buttons: [
                                {
                                  text: '确定',
                                  handler: data => {
                                    this.storage.remove('token').then(() => {
                                      this.navCtrl.setRoot(LoginPage);
                                    });
                                    console.log(data);
                                    // this.navCtrl.setRoot()
                                  }
                                }
                              ]
                            }).present();
                          } else {
                            orderLoading.dismiss().then(() =>{
                              this.alertCtrl.create({
                                title: res.msg,
                                buttons: [
                                  {
                                    text: '确定',
                                  }
                                ]
                              }).present();
                            });

                          }
                        });
                      } else {
                        orderLoading.dismiss();
                      }
                    }
                  }).catch(e => {
                    orderLoading.dismiss();
                  });
                }).catch(e =>{
                  orderLoading.dismiss();
                  console.log(e);
                });
              } else {
                orderLoading.dismiss();
              }
            }
          },
          {
            text: '取消',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      numCtrl.present();

    } else {


      let orderLoading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: '处理中...'
      });
      orderLoading.present();

      if (officeId && value && this.todayStr) {
        this.dbService.openDataBase().then((db: SQLiteObject) =>{
          let sqlStr = `select a.id id from ct_plan a,ct_meal b where a.meal_id = b.id and b.office_id = '${officeId}' and b.meal_type = '${value}' and a.del_flag='0' AND b.del_flag ='0' and a.start_date<='${this.todayStr}' AND a.end_date>='${this.todayStr}'`;
          db.executeSql(sqlStr, {}).then(res =>{
            if (res.rows.length) {
              this.planId = res.rows.item(0).id;

              //下单操作
              if (de.id && this.planId && this.factoryId && officeId && this.todayStr) {
                let params = {
                  'factoryId': this.factoryId,
                  'officeId': officeId,
                  'planId': this.planId,
                  'dinnerDate': this.todayStr,
                  'isPre': 1,
                  'mealType': value,
                  'ctOrderProductList': [{'objNum': 1, 'objId': de.id }],
                };
                this.httpDataPro.createOrder(params).then(res => {
                  if (res.success) {
                    orderLoading.dismiss().then(() =>{
                      this.alertCtrl.create({
                        title: '订餐成功',
                        subTitle: '请到“待消费”列表查看详情',
                        buttons: [
                          {
                            text: '确定',
                            handler: data => {
                              this.navCtrl.setRoot(WaitingUsePage);
                            }
                          }
                        ]
                      }).present();
                    });
                  } else if (res.errorCode === '-2') {
                    orderLoading.dismiss();
                    this.alertCtrl.create({
                      subTitle: '登录信息失效，请重新登录',
                      buttons: [
                        {
                          text: '确定',
                          handler: data => {
                            this.storage.remove('token').then(() => {
                              this.navCtrl.setRoot(LoginPage);
                            });
                            console.log(data);
                            // this.navCtrl.setRoot()
                          }
                        }
                      ]
                    }).present();
                  } else {
                    orderLoading.dismiss().then(() =>{
                      this.alertCtrl.create({
                        title: res.msg,
                        buttons: [
                          {
                            text: '确定',
                          }
                        ]
                      }).present();
                    });

                  }
                });
              } else {
                orderLoading.dismiss();
              }
            }
          }).catch(e => {
            orderLoading.dismiss();
          });
        }).catch(e =>{
          orderLoading.dismiss();
          console.log(e);
        });
      } else {
        orderLoading.dismiss();
      }
    }



  }

  // 返回主页
  gotoHomePage() {
    this.commonHelper.GoBackHomePage();
  }

  gotoUnreadMessage() {
    this.navCtrl.push('unread-message');
  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }

  goSettingPage() {
    this.navCtrl.push('setting');
  }

  //  弹出二维码页面
  gotoQRCodePage() {
    this.navCtrl.push('qr-code');
  }

}
