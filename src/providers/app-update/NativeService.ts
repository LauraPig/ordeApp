/**
 * Created by jianning.liang on 2018/7/2.
 */
import {Injectable} from '@angular/core';
import {Platform, AlertController, ToastController} from 'ionic-angular';
import {AppVersion} from '@ionic-native/app-version';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
// import {Transfer, TransferObject} from '@ionic-native/transfer';

import {FileOpener} from '@ionic-native/file-opener';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import { Diagnostic } from '@ionic-native/diagnostic';
import {HttpDataProviders} from "../http-data/http-data";
import {Utils} from "../../utils";
import {Storage} from '@ionic/storage';


import { Observable } from 'rxjs/Rx';
import {DataBaseService} from "../database/database";

@Injectable()
export class NativeService {

  apkUrl: string;
  isForce: string;
  updateProgress = -1;
  // systemVersion: string;

  constructor(private platform: Platform,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private transfer: FileTransfer,
              private appVersion: AppVersion,
              private file: File,
              private storage: Storage,
              private dataBaseService: DataBaseService,
              private fileOpener: FileOpener,
              private httpDataPro: HttpDataProviders,
              private diagnostic: Diagnostic,
              private inAppBrowser: InAppBrowser) {
    // this.systemVersion = this.device.version;
    // alert('systemVersion' + this.systemVersion);
  }


  /**
   * 检查app是否需要升级
   */
  detectionUpgrade(isInit?: boolean) {
    if (this.updateProgress === -1 || this.updateProgress === 100) {
      // alert('检查更新。。');
      if (!this.isMobile()) {
        return;
      }
      this.appVersion.getVersionNumber().then(data => {
        // alert('版本号-->' + data);
        if (data) {
          let params = {
            'versionNo': data
          };

          this.httpDataPro.checkAppUpdate(params).then(res =>{
            // alert('res- in checkUpdate--> ' + JSON.stringify(res));
            if (res.success && res.body.versionNo && res.body.versionNo !== data) {
              this.apkUrl = res.body.azurepath;
              this.isForce = res.body.isForce;

              // 判断是否强制更新
              if (res.body.isForce === '1') {
                this.alertCtrl.create({
                  title: '升级',
                  subTitle: '发现新版本,请更新后再使用',
                  enableBackdropDismiss: false, // 不允许点击弹出框背景
                  buttons: [
                    {
                      text: '取消',
                      handler: () =>{
                        this.dataBaseService.deleteDataBase().then(_ =>{
                          this.storage.remove('HasCreateDb');
                        });
                        this.platform.exitApp();
                      }
                    },
                    {
                      text: '确定',
                      handler: () => {
                        this.dataBaseService.deleteDataBase().then(_ =>{
                          this.storage.remove('HasCreateDb');
                        });
                        this.downloadApp();
                      }
                    }
                  ]
                }).present();
              } else {
                this.alertCtrl.create(
                  {
                  title: '升级',
                  subTitle: '发现新版本,是否立即升级？',
                  buttons: [
                    {
                      text: '取消',
                    },
                    {
                      text: '确定',
                      handler: () => {
                        this.downloadApp();
                      }
                    }
                  ]
                }).present();
              }
            } else if (data && !isInit) {
              this.toastCtrl.create({
                message: '已经是最新版',
                duration: 1000,
                position: 'middle'
              }).present();
              return;
            }

          }).catch(e =>{
            // alert('e--in-getVersion-http' + e.toString());
          });
        }
      });

    } else {

      const alert = this.alertCtrl.create({
        title: `下载进度：${this.updateProgress}%`,
        buttons: [{ text: '后台下载' }]
      });
      alert.present();
      const interval = setInterval(() => {
        alert.setTitle(`下载进度：${this.updateProgress}%`);
        if (this.updateProgress == 100) {
          clearInterval(interval);
          alert && alert.dismiss();
        }
      }, 1000);
    }

    // 这里连接后台获取app最新版本号,然后与当前app版本号(this.getVersionNumber())对比
    // 版本号不一样就需要申请,不需要升级就return
  }

  /**
   * 下载安装app
   */
  downloadApp() {

    if (this.isAndroid()) {
      if (!this.apkUrl) {
        this.alertCtrl.create({
          subTitle: '未找到android apk下载地址',
          buttons: [
            {
              text: '确定'
            }
          ]
        }).present();
        // alert('未找到android apk下载地址');
        return;
      }
      this.externalStoragePermissionsAuthorization().subscribe(() => {
        let backgroundProcess = false; // 是否后台下载
        let alert; // 显示下载进度
        if (this.isForce === '1') {// 如果是强制更新则没有后台下载按钮
          alert = this.alertCtrl.create({
            title: '下载进度：0%',
            enableBackdropDismiss: false
          });
        } else {
          alert = this.alertCtrl.create({
            title: '下载进度：0%',
            enableBackdropDismiss: false,
            buttons: [{
              text: '后台下载', handler: () => {
                backgroundProcess = true;
              }
            }]
          });
        }
        alert.present();
        const fileTransfer: FileTransferObject = this.transfer.create();
        const apk = this.file.externalDataDirectory + 'download/' + `android_${Utils.getSequence()}.apk`;  // 下载apk保存的目录

        // alert('路径-apk-->' + apk);
        // 下载并安装apk
        fileTransfer.download(this.apkUrl, apk).then(() => {
          alert && alert.dismiss();
          this.dataBaseService.deleteDataBase().then(() =>{
            // alert('删除数据库成功');
            // this.toastCtrl.create({
            //   message: '删除数据库成功',
            //   duration: 2000,
            //   position: 'middle',
            //   cssClass: 'toast-ctrl'
            // }).present();
            this.storage.remove('coldVersion');
            this.storage.remove('hotVersion');
            this.storage.remove('HasCreateDb').then(() =>{
              this.fileOpener.open(apk, 'application/vnd.android.package-archive').catch(e => {
                this.alertCtrl.create({
                  title: '本地升级失败',
                  subTitle: '前往网页下载？',
                  buttons: [{
                    text: '确定', handler: () => {
                      this.openUrlByBrowser(this.apkUrl); // 打开网页下载
                    }
                  }
                  ]
                }).present();
              });
            });
          }).catch(e => {
            // this.toastCtrl.create({
            //   message: e.toString(),
            //   duration: 2000,
            //   position: 'middle',
            //   cssClass: 'toast-ctrl'
            // }).present();
          });
        }, err => {
          this.updateProgress = -1;
          alert && alert.dismiss();
          // this.logger.log(err, 'android app 本地升级失败');
          this.alertCtrl.create({
            title: '本地升级失败',
            subTitle: '前往网页下载？',
            buttons: [{
              text: '确定', handler: () => {
                this.openUrlByBrowser(this.apkUrl); // 打开网页下载
              }
            }
            ]
          }).present();
        });

        let timer = null; // 由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
        fileTransfer.onProgress((event: ProgressEvent) => {
          const progress = Math.floor(event.loaded / event.total * 100); // 下载进度
          this.updateProgress = progress;
          if (!timer) {
            // 更新下载进度
            timer = setTimeout(() => {
              if (progress === 100) {
                alert && alert.dismiss();
              } else {
                if (!backgroundProcess) {
                  const title = document.getElementsByClassName('alert-title')[0];
                  title && (title.innerHTML = `下载进度：${progress}%`);
                }
              }
              clearTimeout(timer);
              timer = null;
            }, 1000);
          }
        });
      });


    }
    if (this.isIos()) {
      // alert('ios暂时未开通此功能');
      this.openUrlByBrowser('https://laurapig.github.io/order/index');
    }
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url:string):void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }


  /**
   * 检测app是否有读取存储权限,如果没有权限则会请求权限
   */
  externalStoragePermissionsAuthorization = (() => {
    let havePermission = false;
    return () => {
      return Observable.create(observer => {
        if (havePermission) {
          observer.next(true);
        } else {
          const permissions = [this.diagnostic.permission.READ_EXTERNAL_STORAGE, this.diagnostic.permission.WRITE_EXTERNAL_STORAGE];
          this.diagnostic.getPermissionsAuthorizationStatus(permissions).then(res => {
            if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
              havePermission = true;
              observer.next(true);
            } else {
              havePermission = false;
              this.diagnostic.requestRuntimePermissions(permissions).then(res => {// 请求权限
                if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
                  havePermission = true;
                  observer.next(true);
                } else {
                  havePermission = false;
                  this.alertCtrl.create({
                    title: '缺少读取存储权限',
                    subTitle: '请在手机设置或app权限管理中开启',
                    buttons: [{text: '取消'},
                      {
                        text: '去开启',
                        handler: () => {
                          this.diagnostic.switchToSettings();
                        }
                      }
                    ]
                  }).present();
                  observer.error(false);
                }
              }).catch(err => {
                observer.error(false);
              });
            }
          }).catch(err => {
            observer.error(false);
          });
        }
      });
    };
  })();

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   * @returns {Promise<string>}
   */
  getVersionNumber(): Promise<string> {
    return new Promise((resolve) => {
      this.appVersion.getVersionNumber().then((value: string) => {
        resolve(value);
      }).catch(err => {
        console.log('getVersionNumber:' + err);
      });
    });
  }
}
