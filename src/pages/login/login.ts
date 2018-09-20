import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from "@ionic/storage";
import {HomePage} from "../home/home";
import {LocationPage} from "../location/location";
import {BackButtonService} from "../../providers/back-button/back-button.service";
import * as moment from 'moment';
import {CommonHelper} from "../../providers/common-helper";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  type: string='password';
  name: string;
  password: string;
  btnStatus: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public commonHelper: CommonHelper,
    public platform: Platform,
    public backButtonService: BackButtonService,
    public httpDataPro: HttpDataProviders,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // 轮询获取消息
  getHasMessage () {
    let reqDateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    let params = {
      'pushDate': reqDateStr,
      'flag': '0'
    };
    this.httpDataPro.fetchHasMessage(params).then (res => {
      if (res.success) {
        this.storage.set('messageCount', res.body.count);
      }
    });
  }

  //  登录按钮
  doLogin() {
    this.btnStatus = true;
    if (this.name && this.password) {
      this.commonHelper.LoadingShow('登录中...');
      let params = {
        'name': this.name,
        'password': this.password,
      };

      this.httpDataPro.checkLogin(params).then(res =>{
        if (res.success) {
          if (res.body.token) {
            this.commonHelper.LoadingHide();
            this.btnStatus = false;
            this.toastCtrl.create({
              message: '登录成功',
              duration: 1000,
              position: 'middle',
              cssClass: 'toast-ctrl'
            }).present();
            this.storage.set('token', res.body.token).then(data => {
              this.getHasMessage();
            });
            this.storage.set('userCode', res.body.user.code);
            this.storage.set('userName', res.body.name.indexOf('(') > -1 ? res.body.name.match('\\((.+?)\\)')[1] : res.body.name);
            this.storage.get('factoryId').then(res => {
              if (res) {
                this.navCtrl.setRoot(HomePage);
              } else {
                this.navCtrl.setRoot(LocationPage);
              }
            });
          } else {
            this.commonHelper.LoadingHide();
            this.btnStatus = false;
            this.alertCtrl.create({
              message: '服务器异常，请联系管理员',
              buttons:[
                {
                  text: '确定',
                  handler: data => {
                    console.log(data);
                    return;
                  }
                }
              ]
            }).present();
          }
        } else {

          this.btnStatus = false;
          this.commonHelper.LoadingHide();

          this.alertCtrl.create({
            // title: '重置密码',
            message: res.msg,
            buttons:[
              {
                text: '确定',
                handler: data => {
                  console.log(data);
                }
              }
            ]
          }).present();
        }
      }).catch(e =>{
        this.commonHelper.LoadingHide();
        this.btnStatus = false;
        console.log(e);
        this.alertCtrl.create({
          message: '服务器异常，请联系管理员',
          buttons:[
            {
              text: '确定',
              handler: data => {
                console.log(data);
              }
            }
          ]
        }).present();
      });
    } else {
      this.btnStatus = false;

      this.alertCtrl.create({
        message: '账号或密码不能为空',
        buttons:[
          {
            text: '确定',
            handler: data => {
              console.log(data);
            }
          }
        ]
      }).present();
    }
  }

  changeType(e: Event) {
    e.stopPropagation();
    this.type = 'password' === this.type ? 'text' : 'password';

  }
}
