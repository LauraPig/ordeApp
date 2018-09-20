import {Injectable} from "@angular/core";
import {HomePage} from "../pages/home/home";
import {AlertController, App, LoadingController, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {HttpDataProviders} from "./http-data/http-data";
import  * as moment from 'moment';
import {SQLiteObject} from "@ionic-native/sqlite";
import {DataBaseService} from "./database/database";

@Injectable()
export  class CommonHelper {

  _loaderding: any;
  constructor(
    public storage: Storage,
    public alertCtrl: AlertController,
    public dbService: DataBaseService,
    public toastCtrl: ToastController,
    public httpDataPro: HttpDataProviders,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
  ) {
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
   * 显示对话框，带取消按钮
   * @param msgtext 提示内容
   * @param handler 确定按钮回调
   * @param cancelHandler 取消按钮回调
   * @param title 标题
   * @param buttonText 确定按钮文本
   * @param cancalBtnText 取消按钮文本
   */

  public AlertWithCancel(msgtext: string, handler?: any, cancelHandler?: any, index?: any, title: string = "提示", buttonText: string = "确定",cancalBtnText: string = '取消') {
    let alertbox = this.alertCtrl.create({
      title: title,
      subTitle: msgtext,
      buttons: [
        {
          text: cancalBtnText,
          handler: () => {
            if (cancelHandler != null) cancelHandler();
          }
        },
        {
          text: buttonText,
          handler: () => {
            if (handler != null) handler(index);
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
   * 显示对话框，带输入框
   * @param title 标题
   * @param inputs 输入框
   * @param handlerCancel 取消按钮回调
   * @param cancelBtnText 取消按钮文本
   * @param handlerOk 确定按钮回调
   * @param okBtnText 确定按钮文本
   */
  public AlertWithInput(title: string = "提示", inputs?: any, handlerCancel?: any,cancelBtnText: string = "取消", handlerOk?: any, okBtnText: string = "确定", id?:any) {
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


  //getHasUnreadMessage
  getHasUnreadMessage = () =>{
    let reqDateStr = moment().format('YYYY-MM-DD HH:MM:SS');
    let params = {
      'pushDate': reqDateStr,
      'flag': '0'
    };
    this.httpDataPro.fetchHasMessage(params).then (res => {
      if (res.success) {
        this.storage.set('messageCount', res.body.count);
      }
    });
  }

  // 轮询获取消息并弹出来
  getHasMessageAndAlert = () =>{
    let reqDateStr = moment().format('YYYY-MM-DD HH:mm:ss');
    let params = {
      'pushDate': reqDateStr,
      'flag': '0'
    };
    this.httpDataPro.fetchHasMessage(params).then (res => {
      // alert('res-in-count->' + JSON.stringify(res));
      if (res.success) {
        this.storage.set('messageCount', res.body.count);

        if (res.body.count > 0) {
          let params = {
            'pushDate': reqDateStr,
            'flag': '1'
          };
          this.httpDataPro.fetchMessageListData(params).then(data => {
            // alert('res-in-messageDetail->' + JSON.stringify(data));
            if (data.success) {
              let temObj = data.body.sysMessageList[0];
              if (moment(reqDateStr).isBefore(temObj.endDate)) {
                this.alertCtrl.create({
                  title: temObj.head || '消息提示',
                  subTitle: temObj.body || '',
                  enableBackdropDismiss: false,
                  buttons: [
                    {
                      text: '确定',
                      handler: res => {
                        console.log(res);
                        this.httpDataPro.changeMessageStatus({'id': temObj.id}).then(res =>{
                          this.getHasUnreadMessage();
                          this.GoBackHomePage();
                          // this.GoBackHomePage();
                          console.log(res);
                        }).catch(e =>{
                          console.log(e);
                        });
                      }
                    }
                  ]
                }).present();
              }
            }
          }).catch( e =>{

          });
        }
      }
    });
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

  /**
   * 根据ID 获取餐品详情信息
   * @params id string
   * @return item object
   *
   */

  public getProductDetailInfoByID (item: any): any{
    let temObj = {};
    if (item && item.proId) {
      this.dbService.openDataBase().then((db: SQLiteObject) => {
        let productNameList: Array<any> = [];
        let blobPathList: Array<any> = [];
        let mealList: Array<any> = [];
        db.executeSql(`select c.product_name productName,c.blob_path blobPath  from ct_product_set_dtl b,ct_product c where b.product_id = c.id and b.del_flag='0' and c.del_flag='0' AND b.product_set_id= '${item.proId}';`, {}).then(data => {
          // alert('data.length--' + data.rows.length);
          if (data.rows.length) {
            for (let j = 0; j < data.rows.length; j++) {
              productNameList.push(data.rows.item(j).productName);
              blobPathList.push(data.rows.item(j).blobPath);
              let productObj = {
                picUrl: data.rows.item(j).blobPath,
                name: data.rows.item(j).productName,
              };
              mealList.push(productObj);
            }
            Object.assign(temObj, {
              imgUrl: blobPathList,
              imgMainUrl: item.blobPath,
              name: item.productName,
              type: Number(item.type),
              price: item.price,
              id: item.id,
              productName: productNameList.join(','),
              productObjList: mealList,  // 套餐下的产品对象
            });
          }
        }).catch(e => {

        });

      }).catch(e => {

      });
      return temObj;
    }
    return;
  }
}
