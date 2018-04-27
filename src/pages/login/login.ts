import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  openForgetPwd() {
    this.alertCtrl.create({
      title: '重置密码',
      message: `<p>集团香港总部（EEL）:</p>
                <p>请联系当地IT重置密码；\n</p>
                <p>广东溢达（GET）/桂林溢达（GLE）：</p>
                <p> 请在“溢充值”平台“我的个人信息”中修改密码；</p>
                <p>其它分厂/部门：</p>
                <p>请在KIOSK系统“考勤自助及工资查询”中修改密码。</p>`,
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
