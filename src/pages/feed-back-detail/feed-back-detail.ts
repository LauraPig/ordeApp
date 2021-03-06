import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ImgUploadService} from "../../providers/upload/img-upload-service";
import { Storage } from '@ionic/storage';
import {HttpDataProviders} from "../../providers/http-data/http-data";
import { ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
import {CommonHelper} from "../../providers/common-helper";
import {TranslateService} from "ng2-translate";

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
  product: boolean = false; //  餐品问题
  hygiene: boolean = false; //  卫生问题
  others: boolean = false;  //  其他问题



  fileList: Array<any> = []; // 图片数组

  type: string;
  content: string;  // 评论
  factoryId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public commonHelper: CommonHelper,
    public translate: TranslateService,
    public modalCtrl: ModalController,
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

  //  勾选类型
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
    this.product = 'product' === value;
    this.hygiene = 'hygiene' === value;
    this.others = 'others' === value;
  }


  //  添加图片按钮
  uploadImg() {
    if (this.fileList.length < 6) {
      this.imgUploadService.showPicActionSheet(this.fileList);
    } else {
      this.translate.get('COMMON.MAX_PHOTOS').subscribe(res =>{
        this.commonHelper.Toast(res, 'middle', 1000);
      });
    }
  }

  // 提交反馈意见
  doSubmit() {
    if (this.type && this.content && this.factoryId) {
      let params = {
        'factoryId': this.factoryId,
        'feedbackType': this.type,
        'detail': this.content,
        'imgUrl': '',
        'blobPath': this.fileList.join(','),
      };


      this.httpDataProvider.submitFeedBack(params).then(res =>{
        if (res && res.success) {

          this.translate.get('COMMON.SUBMIT_SUCCESSED').subscribe(data =>{
            this.commonHelper.Toast(res.msg || data, 'middle', 1000);
          });

          // 返回上一页
          this.navCtrl.pop();
        } else {

          this.translate.get('COMMON.SUBMIT_FAILD').subscribe(data =>{
            this.commonHelper.Toast(res.msg || data, 'middle', 1000);
          });
        }
      }).catch(e =>{
        console.log(e);
      });
    } else {
      this.translate.get('COMMON.NO_CONTENT').subscribe(data =>{
        this.commonHelper.Alert(data);
      });
    }

  }


  // 浏览图片
  viewPhoto(index: number) {
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: this.fileList.map((item, index) =>{
        return {
          url: item,
          type: ''
        }
      }),
      initialSlide: index
    });
    modal.present();
  }

  // 删除图片
  deleteImg(index: number) {
    if (index || index === 0 ) {
      this.translate.get('FEED_DETAIL.DELETE_PHOTO').subscribe(data =>{
        this.commonHelper.AlertWithCancel(data.MSG, this.okHandler, ()=>{}, index, data.TITLE, data.OK_TEXT, data.CANCEL_TEXT);
      });
    }
  }

  okHandler = (index?:any) =>{
    if (index === null || index === undefined) return;
    let params = {
      imgUrl: this.fileList[index]
    };

    this.httpDataProvider.deletePhoto(params).then(res => {
      if (res && res.success) {
        this.fileList.splice(index, 1);
      } else {
        this.translate.get('FEED_DETAIL.DELETE_FAILED').subscribe(data =>{
          this.commonHelper.Toast(res.msg || data, 'middle', 1000);
        });
      }
    }).catch(e =>{
      console.log(e);
    });
  }





}
