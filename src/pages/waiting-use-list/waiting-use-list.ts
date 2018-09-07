import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import * as moment from 'moment';

import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {WaitingUsePage} from "../waiting-use/waiting-use";
import {OrderPage} from "../order/order";
/**
 * Generated class for the WaitingUseListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'waiting-use-list'
})
@Component({
  selector: 'page-waiting-use-list',
  templateUrl: 'waiting-use-list.html',
})
export class WaitingUseListPage {

  item: object;
  factoryName: string;
  todayStr: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
  ) {
    this.item = this.navParams.get('item');

    // 获取当前工厂名称
    this.storage.get('factoryName').then(res =>{
      if (res) {
        this.factoryName = res;
      }
    });
  }

  ionViewWillEnter () {

    // 获取当前时间
    this.todayStr = moment().format('MM/DD/YYYY');
    console.log('ionViewDidLoad WaitingUseListPage');
  }

  // 打包
  pack(id: string, isPack: string) {
    if (isPack === '1') {
      this.alertCtrl.create({
        title: '确认打包',
        subTitle: '打包：请在就餐时间段内前往对应取餐窗口取走您的餐品。',
        buttons: [
          {
            text: '确定',
            handler: data => {
              if (id) {
                let params = {
                  'id': id
                };
                this.httpDataPro.pack(params).then(res =>{
                  if (res && res.success) {
                    this.alertCtrl.create({
                      title: res.msg,
                      buttons: [{
                        text: '确定',
                        handler: data => {
                          this.navCtrl.setRoot(WaitingUsePage);
                        }
                      }]
                    }).present();
                  } else {
                    this.alertCtrl.create({
                      title: res.msg,
                      buttons: [{
                        text: '确定'
                      }]
                    }).present();
                  }
                }).catch(e => {
                  console.log(e);
                });
              } else {
                alert('订单标识为空');
              }
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

  // 留餐
  holdOrder(id: string) {
    this.alertCtrl.create({
      title: '确认留餐',
      subTitle: '留餐：若中午13：30前未到主餐厅取餐，请移步水吧取餐。',
      buttons: [
        {
          text: '确定',
          handler: data => {
            if (id) {
              let params = {
                'id': id
              };
              this.httpDataPro.hold(params).then(res =>{
                if (res && res.success) {
                  this.alertCtrl.create({
                    title: res.msg,
                    buttons: [{
                      text: '确定',
                      handler: data => {
                        this.navCtrl.setRoot(WaitingUsePage);
                      }
                    }]
                  }).present();
                } else {
                  this.alertCtrl.create({
                    title: res.msg,
                    buttons: [{
                      text: '确定'
                    }]
                  }).present();
                }
              }).catch(e => {
                console.log(e);
              });
            } else {
              alert('订单标识为空');
            }
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

  // 编辑
  edit(id: string) {
    this.alertCtrl.create({
      title: '确认编辑',
      subTitle: '是否确定取消该订餐，并重新预订?',
      buttons: [
        {
          text: '确定',
          handler: data => {
            if (id) {
              let params = {
                'id': id
              };
              this.httpDataPro.unsubscribeOrder(params).then(res => {
                if (res && res.success) {
                  this.navCtrl.setRoot(OrderPage);
                } else {
                  this.alertCtrl.create({
                    title: '操作失败',
                    buttons: [{
                      text: '确定'
                    }]
                  }).present();
                }
              }).catch(e => {
                console.log(e);
              })
            } else {
              alert('订单标识为空');
            }

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
            if (id) {
              let params = {
                'id': id
              };
              this.httpDataPro.unsubscribeOrder(params).then(res => {
                if (res && res.success) {
                  this.alertCtrl.create({
                    title: res.msg,
                    buttons: [{
                      text: '确定',
                      handler: data => {
                        this.navCtrl.setRoot(WaitingUsePage);
                      }
                    }]
                  }).present();
                } else {
                  this.alertCtrl.create({
                    title: res.msg,
                    buttons: [{
                      text: '确定'
                    }]
                  }).present();
                }
              }).catch(e => {
                console.log(e);
              })
            } else {
              alert('订单标识为空');
            }
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
