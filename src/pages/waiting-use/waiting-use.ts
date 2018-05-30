import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
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

    })
    console.log('ionViewDidLoad WaitingUsePage');
  }

  getDataList(userId: string, dinnerDate: string) {
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
        }
      }).catch(e =>{

      });
    }

  }

  // 打包
  pack() {
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
  }

  // 打包
  holdOrder() {
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
  cancelOrder () {
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
