import { Injectable } from "@angular/core";
import {ActionSheetController, LoadingController, ToastController} from "ionic-angular";

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import *  as moment from 'moment';

import {HttpDataProviders} from "../http-data/http-data";

@Injectable()
export class ImgUploadService {

  fileList: Array<any> = [];
  // 图片上传的的api
  public uploadApi: string;

  accessid: string;
  policy: string;
  signature: string;
  dir: string;
  expire: string;
  callbackbody :string;

  // 调用相机时传入的参数
  private cameraOpt = {
    quality: 50,
    destinationType: 1, // Camera.DestinationType.FILE_URI,
    sourceType: 1, // Camera.PictureSourceType.CAMERA,
    encodingType: 0, // Camera.EncodingType.JPEG: 0, Camera.EncodingType.PNG: 1
    mediaType: 0, // Camera.MediaType.PICTURE,
    allowEdit: true,
    correctOrientation: true
  };

  // // 调用相册时传入的参数
  // private imagePickerOpt = {
  //     maximumImagesCount: 6,//选择一张图片
  //     width: 800,
  //     height: 800,
  //     quality: 80,
  //     // outputType: 0
  //   };

  upload: any= {
    // fileKey: 'upload',//接收图片时的key
    // fileName: 'imageName.jpg',
    headers: {
      'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', //不加入 发生错误！！
      // 'Content-Type': 'application/octet-stream',
      // 'Content-Type': 'image/jpeg;imgae/png;image/jpg',
      // "x-oss-meta-author": "1",
    },
    params: {}, //需要额外上传的参数
    success: (data)=> { alert('uploadSuccess-->' + data); },//图片上传成功后的回调
    error: (err)=> {  alert('uploadError-->' + JSON.stringify(err)); },//图片上传失败后的回调
    listen: ()=> { }//监听上传过程
  };

  constructor(
    private actionSheetCtrl: ActionSheetController,
    // private noticeSer:ToastService,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private transfer: FileTransfer,
    private file: File,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private toastCtrl: ToastController,
    private httpDataProvider: HttpDataProviders,
    private fileTransfer: FileTransferObject) {

    this.fileTransfer= this.transfer.create();
  }

  public setUploadAPI(api: string) {
    this.uploadApi = api || '';
    alert('api' + api);
  }

  showPicActionSheet(fileList: Array<any>) {

    this.storage.get('ossExprire').then(data =>{
      if (data) {
        let now = moment().format('X');
        // alert('now--->' + now);
        if (Number(data) < Number(now) + 3) {
          this.fetSignByHttp(fileList);
        } else {
          this.storage.get('ossInfo').then(res =>{
            if (res) {
              let temInfo = JSON.parse(res);
              this.uploadApi = temInfo.host || '';
              this.signature = temInfo.signature || '';
              this.policy = temInfo.policy || '';
              this.expire = temInfo.expire || '';
              this.accessid = temInfo.accessid || '';
              this.dir = temInfo.dir || '';
              this.useASComponent(fileList);
            } else {
              this.fetSignByHttp(fileList);
            }
          });

        }
      } else {
        this.fetSignByHttp(fileList);
      }
    });
    // this.useASComponent();
  }

  // 调用接口获取签名
    fetSignByHttp(fileList: Array<any>) {
      let params = {};
      this.httpDataProvider.fetchUploadUrl(params).then(res =>{
        if (res && res.success) {
          const temRes = res.body;
          this.uploadApi = temRes.host || '';
          this.signature = temRes.signature || '';
          this.policy = temRes.policy || '';
          this.expire = temRes.expire || '';
          this.accessid = temRes.accessid || '';
          this.dir = temRes.dir || '';
          this.storage.remove('ossExprire');
          this.storage.remove('ossInfo');
          this.storage.set('ossExprire', temRes.expire);
          this.storage.set('ossInfo', JSON.stringify(temRes));
          // alert('dir--->' + res.body.dir);
          // this.uploadApi = 'http://dininghall.oss-cn-shenzhen.aliyuncs.com';
          this.useASComponent(fileList);
        } else {
          this.toastCtrl.create({
            message: '访问接口失败',
            duration: 1000,
            position: 'middle',
            cssClass: 'toast-ctrl'
          }).present();
        }
      }).catch(e =>{
        this.toastCtrl.create({
          message: '访问接口失败',
          duration: 1000,
          position: 'middle',
          cssClass: 'toast-ctrl'
        }).present();
      });
    }

  // 使用ionic中的ActionSheet组件
  private useASComponent(fileList: Array<any>) {
    let actionSheet= this.actionSheetCtrl.create({
      title: '请选择',
      buttons: [
        {
          text: '拍照',
          handler: ()=> {
            this.startCamera(fileList);
          }
        },
        {
          text: '从手机相册选择',
          handler: ()=> {
            this.openImgPicker(fileList);
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: ()=> {

          }
        }
      ]
    });
    actionSheet.present();
  }

// 启动拍照功能
  private startCamera(fileList: Array<any>) {
    this.camera.getPicture(this.cameraOpt).then((imageData)=> {
      // alert('imageData-->' + imageData);
      this.uploadImg(imageData, fileList);
    }, (err)=>{
      alert('错误信息:'+ err);//错误：无法使用拍照功能！
    });
  }

  // 打开手机相册
  private openImgPicker(fileList: Array<any>) {

  const imagePickerOpt = {
      maximumImagesCount: 6 - fileList.length,//选择一张图片
      width: 800,
      height: 800,
      quality: 80,
    };
    let temp = '';
    this.imagePicker.getPictures(imagePickerOpt).then((results)=> {
      if (results.length > 0) {
        let upLoading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: '上传中...'
        });
        upLoading.present();
        for (var i = 0; i < results.length; i++) {
          temp = results[i];
          this.uploadImg(temp,fileList);
          if (i === results.length - 1) {
            upLoading.dismiss();
            this.toastCtrl.create({
              message: '上传成功',
              duration: 1000,
              position: 'middle',
              cssClass: 'toast-ctrl'
            }).present();
          }
        }
      }

    }, (err)=> {
      // upLoading.dismiss();
      this.toastCtrl.create({
        message: '上传失败',
        duration: 1000,
        position: 'middle',
        cssClass: 'toast-ctrl'
      }).present();
      alert('ERROR:'+ err);//错误：无法从手机相册中选择图片！
    });
  }


  // 上传图片
  private uploadImg(path:string, fileList: Array<any>) {
    if (!path) {
      return;
    }

    let arr = path.split('/');
    // alert('fileName--->' + arr[arr.length - 1]);


    let options:any;
    options = {
      fileKey: 'file',
      fileName: arr[arr.length - 1],
      headers: this.upload.headers,
      httpMethod: 'POST',
      mimeType: 'image/jpeg;image/jpg;image/png',
      params: {
        'key' : this.dir + '${filename}',
        'policy': this.policy,
        'OSSAccessKeyId': this.accessid,
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'signature': this.signature,
      }
    };
    let blobPath  = `${this.uploadApi}/${this.dir}${options.fileName}`;

    this.fileTransfer.upload(path, this.uploadApi, options)
      .then((data)=> {
        if (data && data.responseCode === 200 ) {
          fileList.push(blobPath);
        }
      }, (err) => {
        if (this.upload.error) {
          this.upload.error(err);
        } else {
        }
      });
  }

  // 停止上传
  stopUpload() {
    if (this.fileTransfer) {
      this.fileTransfer.abort();
    }
  }
}
