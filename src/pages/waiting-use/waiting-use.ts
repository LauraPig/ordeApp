import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import * as moment from 'moment';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from '@ionic/storage';

/**
 * Generated class for the WaitingUsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waiting-use',
  templateUrl: 'waiting-use.html',
})
export class WaitingUsePage {

  dataList: Array<any> = [];
  userId: string;
  todayStr: string;
  factoryName: string;
  // isPack: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
  ) {
  }

  ionViewDidLoad() {
    this.todayStr = moment().format('YYYY-MM-DD');
    this.storage.get('userId').then(res =>{
      if (res) {
        this.userId = res;
        let dateStr = `${moment().format('YYYY-MM-DD')} 00:00:00`;
        this.getDataList(res, dateStr);
      }

    });

    // 获取当前工厂名称
    this.storage.get('factoryName').then(res =>{
      if (res) {
        this.factoryName = res;
      }
    });
    console.log('ionViewDidLoad WaitingUsePage');
  }



  getDataList(userId: string, dinnerDate: string){

    let dataLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '加载中...'
    });

    dataLoading.present();



    if (userId && dinnerDate) {
      let params = {
        'userId': userId,
        'dinnerDate': dinnerDate
      }
      this.httpDataPro.fetchWaitingListData(params).then(res =>{
        // alert('res-data--' + JSON.stringify(res));
        if (res.success && res.body) {
          for (let key in res.body) {
            let tempObj = {
              dateStr: key,
              list: res.body[key],
            };
            this.dataList.push(tempObj);

          }
          dataLoading.dismiss();
        }
      }).catch(e =>{
        dataLoading.dismiss();
      });
    } else {
      dataLoading.dismiss();
    }

  }

  // 跳转到某天的所有订单
  gotoDetailList(item: any) {
    this.navCtrl.push('waiting-use-list', {
      item
    });
  }

  // 打包
  pack(id: string, isPack: string) {
     // alert('isPack--> ' + isPack);
    //  1  为可以打包， 0 不能打包
    if (isPack === '1') {
      this.alertCtrl.create({
        title: '确认打包',
        subTitle: '打包：请在就餐时间段内前往对应取餐窗口取走您的餐品。',
        buttons: [
          {
            text: '确定',
            handler: data => {
              // this.navCtrl.setRoot()
            }
          },
          {
            text: '取消',
            handler: data => {
              // this.navCtrl.setRoot()
            }
          }
        ]
      }).present();
    } else if (isPack === '0') {
      this.alertCtrl.create({
        // title: '',
        subTitle: '该产品不能打包',
        buttons: [
          {
            text: '确定',
            handler: data => {
              // this.navCtrl.setRoot()
            }
          }
        ]
      }).present();
    } else {
      this.alertCtrl.create({
        // title: '',
        subTitle: '此功能未开放，敬请期待',
        buttons: [
          {
            text: '确定',
            handler: data => {
              // this.navCtrl.setRoot()
            }
          }
        ]
      }).present();
    }
  }

  // 编辑
  edit(id: string) {
    this.alertCtrl.create({
      title: '确认编辑',
      subTitle: '是否确定取消该订餐，并重新预订',
      buttons: [
        {
          text: '确定',
          handler: data => {
            // this.navCtrl.setRoot()
          }
        },
        {
          text: '取消',
          handler: data => {
            // this.navCtrl.setRoot()
          }
        }
      ]
    }).present();
  }

  // 留餐
  holdOrder(id: string) {
    this.alertCtrl.create({
      title: '确认留餐',
      subTitle: '留餐：若中午13：30前未到主餐厅取餐，请移步面食馆取餐。',
      buttons: [
        {
          text: '确定',
          handler: data => {
            // this.navCtrl.setRoot()
          }
        },
        {
          text: '取消',
          handler: data => {
            // this.navCtrl.setRoot()
          }
        }
      ]
    }).present();
  }

  // 退订
  cancelOrder (id: string) {
    this.alertCtrl.create({
      title: '退订',
      subTitle: '确定您要退订吗？',
      buttons: [
        {
          text: '确定',
          handler: data => {
            // this.navCtrl.setRoot()
          }
        },
        {
          text: '取消',
          handler: data => {
            // this.navCtrl.setRoot()
          }
        }
      ]
    }).present();
  }

  goHomeMenuPage() {
    this.navCtrl.push('homeMenu');
  }

  goSettingPage() {
    this.navCtrl.push('setting');
  }

}
