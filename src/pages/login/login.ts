import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import {Storage} from "@ionic/storage";
import {HomePage} from "../home/home";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public httpDataPro: HttpDataProviders,
    public alertCtrl: AlertController
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doLogin() {
    // let loginLoading = this.
    if (this.name && this.password) {
      let params = {
        'name': this.name,
        'password': this.password,
        // 'token': this.password,
      }

      this.httpDataPro.checkLogin(params).then(res =>{
        // alert('res--login-> ' + JSON.stringify(res));
        if (res.success) {
          this.storage.set('token', res.body.token);
          this.navCtrl.setRoot(HomePage);
        }
      });
    }
  }

  changeType(e: Event) {
    e.stopPropagation();
    // e.preventDefault();
    // e.preventDefault();
    this.type = 'password' === this.type ? 'text' : 'password';
    // const pwdSelector = document.getElementById('pwd');
    // console.log('type--->',pwdSelector.getAttribute('type'));
    // if (pwdSelector.getAttribute('type') === 'password') {
    //   pwdSelector.setAttribute('type','text');
    // } else {
    //   pwdSelector.setAttribute('type','password');
    // }

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
