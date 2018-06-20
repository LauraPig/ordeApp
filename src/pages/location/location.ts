import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import { Storage } from '@ionic/storage';
import {HomePage} from "../home/home";

/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
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
