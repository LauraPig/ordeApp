import {Injectable} from "@angular/core";
import {HomePage} from "../pages/home/home";
import {AlertController, App, LoadingController, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";

@Injectable()
export  class CommonHelper {

  _loaderding: any;
  constructor(
    public storage: Storage,
    public alertCtrl: AlertController,
    // public http: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    // public actionSheetCtrl: ActionSheetController,
    public appCtrl: App,
  ) {
    //this.localstorage.clear();
    // this.UpdateAPIURL();
  }

  public GoBackHomePage() {
    return this.appCtrl.getRootNav().setRoot(HomePage);
  }

  /**
   * 显示对话框，没有取消按钮
   * @param msgtext 对话框内容
   * @param title 标题
   * @param buttonText 按钮文本
   */
  public Alert(msgtext: string, handler?: any, title: string = "提示", buttonText: string = "确定") {
    let alertbox = this.alertCtrl.create({
      title: title,
      subTitle: msgtext,
      buttons: [{
        text: buttonText,
        handler: () => {
          if (handler != null) handler();
        }
      }]
    });
    return alertbox.present().then(() => {
      setTimeout(() => {
        alertbox.dismiss();
      }, 20000);
    });
  }

  /**
   * 显示对话框，没有取消按钮
   * @param msgtext 对话框内容
   * @param title 标题
   * @param buttonText 按钮文本
   */
  public AlertWithCancel(title: string = "提示", inputs: any, handlerCancel?: any,cancelBtnText: string = "取消", handlerOk?: any, okBtnText: string = "确定", id?:any) {
    let alertbox = this.alertCtrl.create({
      title: title,
      inputs: inputs,
      buttons: [
        {
          text: cancelBtnText,
          handler: () => {
            if (handlerCancel != null) handlerCancel();
          }
        },
        {
          text: okBtnText,
          handler: inputData =>{
            if (handlerOk != null) handlerOk(id, inputData);
          }
        }
      ]
    });
    return alertbox.present().then(() => {
      setTimeout(() => {
        alertbox.dismiss();
      }, 20000);
    });
  }

  /**
   * Toast消息显示
   * @param msgtext 消息文本
   * @param position 显示位置 top|middle|bottom
   * @param duration 持续显示时间(毫秒)
   */
  public Toast(msgtext: string, position: string = "bottom", duration: number = 3000) {
    let toast = this.toastCtrl.create({
      message: msgtext,
      duration: duration,
      position: position,
      //showCloseButton: true,
      //closeButtonText: 'Ok'
      // cssClass: 'my-toast my-toast-error'
    });
    return toast.present();
  }

  /**
   * 显示Loading
   * @param loadingtext loading文本
   * @param duration 自动消失时长
   */
  public LoadingShow(loadingtext: string = "Please wait...", duration: number = 0) {
    this.LoadingHide();
    this._loaderding = this.loadingCtrl.create({
      content: loadingtext,
      duration: duration
    });
    return this._loaderding.present();
  }
  // public ActionSheetShow(title: string, buttons: any = []) {
  //   const actionSheet = this.actionSheetCtrl.create({
  //     title: title,
  //     buttons: buttons
  //   });
  //   return actionSheet.present();
  // }
  /**
   * 关闭Loading
   */
  public LoadingHide() {
    if (this._loaderding != null) {
      this._loaderding.dismiss();
      this._loaderding = null;
    }
  }


  /**
   * 获取语言设置
   * @params
   * @return lang string
   *
   */

  public getCurrentLanguage () {
   return this.storage.get('lang');
  }

}
