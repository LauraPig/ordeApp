import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ImgUploadService} from "../../providers/upload/img-upload-service";
import { Storage } from '@ionic/storage';
import {LoginPage} from "../login/login";
import {HttpDataProviders} from "../../providers/http-data/http-data";

/**
 * Generated class for the FeedBackDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'feed-back-detail'
})
@Component({
  selector: 'page-feed-back-detail',
  templateUrl: 'feed-back-detail.html',
})
export class FeedBackDetailPage {
  product: boolean = false;
  hygiene: boolean = false;
  others: boolean = false;



  fileList: Array<any> = [];

  type: string;
  content: string;
  factoryId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public toastCtrl: ToastController,
    public httpDataProvider: HttpDataProviders,
    public alertCtrl: AlertController,
    public imgUploadService: ImgUploadService,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedBackDetailPage');
  }

  ionViewWillEnter() {
    this.storage.get('factoryId').then(res =>{
      if (res) {
        this.factoryId = res;
      }
    });
  }

  selectValue (value: string) {

    switch (value) {
      case 'product':
        this.type = '1';
        break;
      case 'hygiene':
        this.type = '2';
        break;
      case 'others':
        this.type = '3';
        break;
      default:
        break;
    }

    // this.type = value && value || '';
    this.product = 'product' === value;
    this.hygiene = 'hygiene' === value;
    this.others = 'others' === value;
    console.log('value----->', this.type);
    console.log('content----->', this.content);
  }

  uploadImg() {
    this.imgUploadService.showPicActionSheet(this.fileList);
  }

  // 提交反馈意见
  doSubmit() {
    // alert('fileList--->' + this.fileList.join(','));
    if (this.type && this.content && this.factoryId) {
      // alert('factoryId--->' + this.factoryId);
      // alert('feedbackType--->' + this.type);
      let params = {
        'factoryId': this.factoryId,
        'feedbackType': this.type,
        'detail': this.content,
        'imgUrl': '',
        'blobPath': this.fileList.join(','),
      };


      this.httpDataProvider.submitFeedBack(params).then(res =>{
        if (res && res.success) {
          this.toastCtrl.create({
            message: res.msg || '提交成功',
            duration: 1000,
            position: 'middle',
            cssClass: 'toast-ctrl'
          }).present();

          this.navCtrl.pop();
        } else {
          this.toastCtrl.create({
            message: res.msg || '提交失败',
            duration: 1000,
            position: 'middle',
            cssClass: 'toast-ctrl'
          }).present();
        }
      }).catch(e =>{
        console.log(e);
      });




    } else {
      this.alertCtrl.create({
        subTitle: '提交内容不能为空',
        buttons: [
          {
            text: '确定',
            // handler: data => {
            //   this.storage.remove('token').then(() => {
            //     this.navCtrl.setRoot(LoginPage)
            //   });
            //   console.log(data);
            //   // this.navCtrl.setRoot()
            // }
          }
        ]
      }).present();
    }

  }

}
