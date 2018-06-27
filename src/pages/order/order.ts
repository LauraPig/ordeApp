import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {CalendarComponentOptions, DayConfig} from 'ion2-calendar'
import * as moment from 'moment'
import {DataBaseService} from "../../providers/database/database";
import {SQLiteObject} from "@ionic-native/sqlite";
import {SelectTypePage} from "../select-type/select-type";
import { Storage } from '@ionic/storage';
import {HomePage} from "../home/home";
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {HttpDataProviders} from "../../providers/http-data/http-data";

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
})
export class OrderPage {
  selectDay: any = moment().format('YYYY年MM月DD');
  monStr: string;
  factoryId: string;
  factoryName: string;
  dayStr: string;
  date: string;
  // dateResult: string;
  days: DayConfig[] = [];
  status: boolean = false; // 控制日期是否显示
  isToday: boolean = true; // 是否今天
  listLength: number;

  typeList: Array<any> = []; // 餐别类型List

  todayStr: string;  // 日期选择器选择的时间 格式： YYYY-MM-DD HH:MM:SS
  planId: string;  // 产品计划ID
  valueStr: string = '';  // 当前展开的餐别
  userName: string;  // 当前用户名称
  messageCount: number;  // 消息条数

  calendarOptions: CalendarComponentOptions = {
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public dbService: DataBaseService,
    public httpDataPro: HttpDataProviders,
  ) {

    this.storage.get('messageCount').then(res =>{
      if (res) {
        this.messageCount = res;
      }

    });



    // 获取参数
    this.factoryId = this.navParams.get('factoryId');
    this.factoryName = this.navParams.get('factoryName');

    // 获取工厂ID
    this.storage.get('factoryId').then(res =>{
      if (res) {
        this.factoryId = res;
      }
    });

    // 获取用户名称
    this.storage.get('userName').then(res =>{
      if (res) {
        this.userName = res;
      }
    });


    // 获取工厂名称
    this.storage.get('factoryName').then(res =>{
      if (res) {
        this.factoryName = res;
      }
    });

    this.todayStr = moment().format('YYYY-MM-DD HH:MM:SS');

    this.monStr = (new Date().getMonth() + 1).toString();
    this.monStr = this.monStr.length === 1 ? '0' + this.monStr : this.monStr;
    this.dayStr = (new Date().getDate()).toString();
    this.dayStr = this.dayStr.length === 1 ? '0' + this.dayStr : this.dayStr;
    this.days.push({
      date: new Date(),
      title: '今天',
      // subTitle: '●',
    });


    // this.days.push({
    //   date: moment().add(1, 'd').toDate(),
    //   subTitle: '●',
    // });
    // this.days.push({
    //   date: moment().add(2, 'd').toDate(),
    //   subTitle: '●',
    // });
    this.calendarOptions = {
      from: new Date(),
      to: moment().add(13, 'd').toDate(),
      pickMode: 'single',
      daysConfig: this.days,
      monthFormat: 'yyyy 年 MM 月 ',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      monthPickerFormat: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

      // defaultDate: new Date(),
      // title: 'test',
    };
  }

  openCalendar() {
    this.status = !this.status;
  }


  ionViewDidLoad() {
    // alert('factoryId--' + this.factoryId);
    if (this.factoryId) {
      this.dbService.openDataBase().then((db: SQLiteObject) =>{
        db.executeSql(`select  b.label as label,b.value as value from ct_meal a,sys_dict_value b,sys_office c where c.parent_ids LIKE '%${this.factoryId}%' AND c.type='4'  AND b.[value]=a.meal_type and a.office_id = c.id AND a.del_flag='0' AND b.del_flag='0' AND c.del_flag = '0' GROUP BY b.label,b.[value],b.sort ORDER BY b.sort;`, {}).then(res =>{
          // alert('res.length' + res.rows.length);
          if (res.rows.length) {
            for ( let i = 0; i < res.rows.length; i++) {
              this.typeList.push({
                label: res.rows.item(i).label,
                imgUrl: `https://dininghall.blob.core.windows.net/product/${res.rows.item(i).value}.png`,
                value: res.rows.item(i).value,
                officeList: [],
                status: false,
              });


            }
            // this.typeList.push(this.typeList[0]);
            // this.typeList.push(this.typeList[0]);
            this.listLength = this.typeList.length;
          }
        }).catch(e =>{
          console.log(e);
        });
      });
    }

    console.log('ionViewDidLoad OrderPage');
  }

  ionViewDidEnter() {
    // const listSelector = document.getElementById('type');
    // alert('count-->' + listSelector.childElementCount);
    // alert('children-->' + listSelector.childNodes[0]);
    // listSelector.children
  }

  // 日期选择事件
  onChange($event) {
    console.log($event);
    const result = moment().format('YYYY-MM-DD');
    // const today = moment().format('YYYY-MM-DD');
    console.log(result);
    this.isToday = $event.toString() === result;
    // this.dateResult = $event.toString();
    this.monStr = (moment($event).get('months') + 1).toString();
    this.dayStr = (moment($event).get('date')).toString();
    this.selectDay = moment($event).format('YYYY年MM月DD');
    this.todayStr = moment($event).format('YYYY-MM-DD HH:MM:SS');
    // this.getGoalDay();
  }


  // 获取餐别下的餐厅
  getMealTypeDetail(item: any, index: number) {
    // alert('index---->' + index);
    // alert('item---->' + item.value);
    // this.typeList[index].status = item.status === false;

    this.valueStr = item.value === this.valueStr ? '' : item.value;

    let name: string = '';
    let temList: Array<any> = [];
    if (item.value && this.factoryId) {
      // alert('value' + this.value);
      // alert('factoryId' + this.factoryId);
      this.dbService.openDataBase().then((db: SQLiteObject) =>{
        db.executeSql(`select DISTINCT  a.name, a.id from sys_office a ,ct_meal b where  a.parent_ids LIKE '%${this.factoryId}%' AND a.type='4' and b.office_id = a.id and b.meal_type = '${item.value}' AND b.del_flag='0' AND a.del_flag='0';`,{}).then(res =>{
          // alert('res: ' + res.rows.length);
          if (res.rows.length) {
            for (let i =0; i < res.rows.length; i ++ ) {
              name = res.rows.item(i).name;
              temList.push({
                id: res.rows.item(i).id,
                name,
                imgUrl: 'https://dininghall.blob.core.windows.net/product/noodle.png',
                status: false,
                productList: [],
              });
            }

            // alert('temList: ' + temList);
            this.typeList[index].officeList = temList;
            // alert('result: ' + this.typeObj[`${this.value}`]);
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

    this.typeList[parentIndex].officeList[childrenIndex].status = p.status === false;

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

          // alert('res.length--' + res.rows.length);
          if (res.rows.length) {
            for (let i = 0; i < res.rows.length; i ++) {
              if (res.rows.item(i).type === 1) {
                let productName: string ='';
                let productNameList: Array<any> = [];
                let blobPathList: Array<any> = [];
                // let productObj = {picUrl: '', name: ''}; //
                let mealList: Array<any> = [];
                db.executeSql(`select c.product_name productName,c.blob_path blobPath  from ct_product_set_dtl b,ct_product c where b.product_id = c.id and b.del_flag='0' and c.del_flag='0' AND b.product_set_id= '${res.rows.item(i).id}';`, {}).then(data =>{
                  // alert('data.length--' + data.rows.length);
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
              // alert('份数--->' + inputData.num);

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
                    // alert('res-length--' + res.rows.length);
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
                          } else {
                            orderLoading.dismiss().then(() =>{
                              alert(res.msg);
                            });

                          }
                        });
                      } else {
                        orderLoading.dismiss();
                      }
                    }
                  }).catch(e => {
                    orderLoading.dismiss();
                    alert('错误-->' + JSON.stringify(e));
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
            // alert('res-length--' + res.rows.length);
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
                  } else {
                    orderLoading.dismiss().then(() =>{
                      alert(res.msg);
                    });

                  }
                });
              } else {
                orderLoading.dismiss();
              }
            }
          }).catch(e => {
            orderLoading.dismiss();
            alert('错误-->' + JSON.stringify(e));
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

  gotoSelectTypePage(value: string, factoryName: string) {
    // alert('this.monstr--order: ' + this.monStr);
    this.navCtrl.setRoot(SelectTypePage, {
      value,
      factoryName,
      factoryId: this.factoryId,
      monStr: this.monStr,
      dayStr: this.dayStr,
      typeList: this.typeList,
    })
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

}
