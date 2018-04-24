import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'detail'
})
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  item: object = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController ) {
    this.item = this.navParams.get('item');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  orderProduct(name: string) {
    if (name) {
      this.alertCtrl.create({
        title: '订餐成功',
        subTitle: '请到“待消费”列表查看详情',
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

}
