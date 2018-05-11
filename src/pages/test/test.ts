import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ZBar, ZBarOptions} from "@ionic-native/zbar";

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'test-page'
})
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private zbar: ZBar,
  ) {
    console.log('TestPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

  doQrScann () {
    // this.navCtrl.push('scan-page');
    let options: ZBarOptions = {
      flash: 'off',
      text_title: '扫码',
      text_instructions: '请将二维码置于红线中央',
      // camera: "front" || "back",
      drawSight: true
    };

    this.zbar.scan(options)
      .then(result => {
        alert("结果：" + result); // Scanned code
        this.navCtrl.pop();
        // const browser = this.iab.create(result);
      })
      .catch(error => {
        alert(error); // Error message
      });
  }


}
