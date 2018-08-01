import { Injectable } from "@angular/core";
import {ActionSheetController, LoadingController, ToastController} from "ionic-angular";

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { UUIDHelper, Utils } from '../../utils'
import {HttpDataProviders} from "../http-data/http-data";
// import { ToastService } from "../toast-service/toast-service";

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

  // 调用相册时传入的参数
  private imagePickerOpt = {
      maximumImagesCount: 6,//选择一张图片
      width: 800,
      height: 800,
      quality: 80,
      // outputType: 0
    };

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
    private toastCtrl: ToastController,
    private httpDataProvider: HttpDataProviders,
    private fileTransfer: FileTransferObject) {

    this.fileTransfer= this.transfer.create();
  }

  public setUploadAPI(api: string) {
    this.uploadApi = api || '';
    alert('api' + api);
  }

  // getFileName(path: string): string {
  //   if(!path) {
  //     return;
  //   }
  //   let arr = path.split('/');
  //   alert('fileName' + arr[arr.length - 1]);
  //   return arr[arr.length - 1];
  //   // let fileName = temStr.substring(0, temStr.indexOf('.'));
  //
  // }

  showPicActionSheet(fileList: Array<any>) {
    let params = {};
    this.httpDataProvider.fetchUploadUrl(params).then(res =>{
      if (res && res.success) {
        this.uploadApi = res.body.host || '';
        this.signature = res.body.signature || '';
        this.policy = res.body.policy || '';
        this.expire = res.body.expire || '';
        this.accessid = res.body.accessid || '';
        this.dir = res.body.dir || '';
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
    // this.useASComponent();
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
      alert('imageData-->' + imageData);
      // this.getFileName(imageData);
      this.uploadImg(imageData, fileList);
    }, (err)=>{
      alert('ERROR:'+ err);//错误：无法使用拍照功能！
    });
  }

  // 打开手机相册
  private openImgPicker(fileList: Array<any>) {
    let temp = '';
    this.imagePicker.getPictures(this.imagePickerOpt).then((results)=> {
      // alert('results-->' + results.length);
      if (results.length > 0) {
        let upLoading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: '上传中...'
          // content: `
          //   <div class="custom-spinner-container">
          //     <div class="custom-spinner-box"></div>
          //   </div>`,
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
      // fileName: arr[arr.length - 1],
      fileName: arr[arr.length - 1],
      headers: this.upload.headers,
      // httpMethod: 'GET',
      httpMethod: 'POST',
      // chunkedMode: false,
      mimeType: 'image/jpeg;image/jpg;image/png',
      // mimeType: 'jpg,gif,png,bmp',
      params: {
        // 'key' : '',
        // 'policy': 'eyJleHBpcmF0aW9uIjoiMjAxOC0wNy0yNlQxNDoyMTo0Ny42ODhaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCIiXV19',
        // 'OSSAccessKeyId': 'LTAIUpqLSZzIK03R',
        // 'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        // 'signature': 'SJCXulH4LUsmqdIl6OSZZZ//poA=',

        'key' : this.dir + '${filename}',
        'policy': this.policy,
        'OSSAccessKeyId': this.accessid,
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'signature': this.signature,
      }
    };
    // let fileInfo = {
    //     blobPath: `${this.uploadApi}/${this.dir}${options.fileName}`,
    //   // fileKey: options.fileKey,
    //   // path,
    // };
    let blobPath  = `${this.uploadApi}/${this.dir}${options.fileName}`;

    this.fileTransfer.upload(path, this.uploadApi, options)
      .then((data)=> {
        if (data && data.responseCode === 200 ) {
          fileList.push(blobPath);
        }
        // alert('success-->' + JSON.stringify(data));

        // if (this.upload.success) {
        //   fileList.push(fileInfo);
        //   this.upload.success(JSON.parse(data.response));
        // }

      }, (err) => {
        if (this.upload.error) {
          this.upload.error(err);
        } else {
          // this.noticeSer.showToast('错误：上传失败！');
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
