import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import { Storage } from '@ionic/storage';
import {HomePage} from "../home/home";
import {LoginPage} from "../login/login";

/**
 * Generated class for the SelectLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'select-location'
})
@Component({
  selector: 'page-select-location',
  templateUrl: 'select-location.html',
})
export class SelectLocationPage {
  location: string;
  currentIndex: number = 0;

  factoryList: Array<any> =[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpDataPro: HttpDataProviders,
    public storage: Storage,
  ) {
    // this.storage.get('factoryId').then(res =>{
    //   if (res) {
    //     this.location = res;
    //   }
    // });
  }

  ionViewDidLoad() {
    this.storage.get('factoryId').then(res =>{
      if (res) {
        this.location = res;
      }
    });
    this.httpDataPro.fetchFactoryListData().then(res => {
      // alert('res-fact---' + JSON.stringify(res));
      if (res.success && res.body) {
        for (let key in res.body) {
          let tempObj = {
            title: key,
            list: res.body[key],
          };
          this.factoryList.push(tempObj);
        }
      }  else if (res.errorCode === '-2') {
        alert('登录信息过期，请重新登录');
        this.storage.remove('token').then(data => {
          console.log(data);
          this.navCtrl.setRoot(LoginPage);
        })
      }
    });
    console.log('ionViewDidLoad SelectLocationPage');
  }

  accordion(index: number) {
    this.currentIndex =  index === this.currentIndex ? -1 : index ;
  }

  setValue(id: string, name: string) {

    // alert('id：' + id);
    // alert('name：' + name);
    if (id && name) {
      this.location = id;
      this.storage.set('factoryId', id);
      this.storage.set('factoryName', name);
      this.navCtrl.setRoot(HomePage);
    }
  }

  changeValue() {

    // for (let key in e) {
    //   alert('key：' + key);
    //   alert('value：' + e[key]);
    // }
    // console.log(this.location);
    // alert('value：' + this.location);
    // alert('当前值ID：' + e);
    // alert('当前值NAME：' + e.toString());
  }

}
