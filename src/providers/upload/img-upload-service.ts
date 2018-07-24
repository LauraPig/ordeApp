import { Injectable } from "@angular/core";
import {ActionSheetController, ToastController} from "ionic-angular";

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

  // 调用相机时传入的参数
  private cameraOpt = {
    quality: 50,
    destinationType: 1, // Camera.DestinationType.FILE_URI,
    sourceType: 1, // Camera.PictureSourceType.CAMERA,
    encodingType: 1, // Camera.EncodingType.JPEG: 0, Camera.EncodingType.PNG: 1
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
      outputType: 0
    };

  upload: any= {
    fileKey: 'upload',//接收图片时的key
    fileName: 'imageName.jpg',
    headers: {
      // 'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', //不加入 发生错误！！
      'Content-Type': "application/octet-stream",
      "x-oss-meta-author": "1",
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

  showPicActionSheet() {
    let params = {};
    this.httpDataProvider.fetchUploadUrl(params).then(res =>{
      if (res && res.success) {
        // this.uploadApi = res.body.url || '';
        this.uploadApi = 'http://dininghall.oss-cn-shenzhen.aliyuncs.com/sit/feedback/a.jpg?Expires=1532539877&OSSAccessKeyId=LTAIUpqLSZzIK03R&Signature=44ZAwhNQyE%2BgJAgxPYc%2B0P6cHPA%3D';
        this.useASComponent();
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
  private useASComponent() {
    let actionSheet= this.actionSheetCtrl.create({
      title: '请选择',
      buttons: [
        {
          text: '拍照',
          handler: ()=> {
            this.startCamera();
          }
        },
        {
          text: '从手机相册选择',
          handler: ()=> {
            this.openImgPicker();
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

// 使用原生的ActionSheet组件
  /*private useNativeAS() {
  let buttonLabels = ['拍照', '从手机相册选择'];
  ActionSheet.show({
  'title': '选择',
  'buttonLabels': buttonLabels,
  'addCancelButtonWithLabel': 'Cancel',
  //'addDestructiveButtonWithLabel' : 'Delete'
  }).then((buttonIndex: number) => {
  if(buttonIndex == 1) {
  this.startCamera();
  } else if(buttonIndex == 2) {
  this.openImgPicker();
  }
  });
  }*/


// 启动拍照功能
  private startCamera() {
    this.camera.getPicture(this.cameraOpt).then((imageData)=> {
      alert('imageData-->' + imageData);
      // this.getFileName(imageData);
      this.uploadImg(imageData);
    }, (err)=>{
      alert('ERROR:'+ err);//错误：无法使用拍照功能！
    });
  }

  // 打开手机相册
  private openImgPicker() {
    // alert('调用相册');
    let temp = '';
    this.imagePicker.getPictures(this.imagePickerOpt).then((results)=> {
      // alert('results-->' + results.length);
      for (var i=0; i < results.length; i++) {
        temp = results[i];
        this.uploadImg(temp);
      }

      // this.uploadImg(temp);

    }, (err)=> {
      alert('ERROR:'+ err);//错误：无法从手机相册中选择图片！
    });


    // this.imagePicker.hasReadPermission().then(result =>{
    //   if (result) {
    //     let temp = '';
    //     this.imagePicker.getPictures(this.imagePickerOpt).then((results)=> {
    //         alert('results-->' + results.length);
    //         for (var i=0; i < results.length; i++) {
    //           temp = results[i];
    //           this.uploadImg(temp);
    //         }
    //
    //         // this.uploadImg(temp);
    //
    //       }, (err)=> {
    //         // this.noticeSer.showToast('ERROR:'+ err);//错误：无法从手机相册中选择图片！
    //       });
    //   } else {
    //     this.imagePicker.requestReadPermission().then(result =>{
    //     });
    //   }
    // });

  }


  // 上传图片
  private uploadImg(path:string) {
    if (!path) {
      return;
    }

    let arr = path.split('/');
    alert('fileName--->' + arr[arr.length - 1]);


    let options:any;
    options = {
      fileKey: UUIDHelper.generateUUID(),
      fileName: arr[arr.length - 1],
      headers: this.upload.headers,
      params: this.upload.params
    };
    let fileInfo = {
      fileName: options.fileName,
      fileKey: options.fileKey,
      path,
    };

    this.fileTransfer.upload(path,this.uploadApi, options)
      .then((data)=> {

        if (this.upload.success) {
          this.fileList.push(fileInfo);
          this.upload.success(JSON.parse(data.response));
        }

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
