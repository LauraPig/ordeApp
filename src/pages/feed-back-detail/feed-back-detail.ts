import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ImgUploadService} from "../../providers/upload/img-upload-service";

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

  type: string;
  content: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public imgUploadService: ImgUploadService,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedBackDetailPage');
  }

  selectValue (value: string) {

    this.type = value && value || '';
    this.product = 'product' === value;
    this.hygiene = 'hygiene' === value;
    this.others = 'others' === value;
    console.log('value----->', this.type);
    console.log('content----->', this.content);
  }

  uploadImg() {
    this.imgUploadService.showPicActionSheet();
  }

}
