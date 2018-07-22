import {Injectable, Injector} from '@angular/core';
import {App, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {HttpProvider} from "../http/http-service";

@Injectable()
export class HttpDataProviders {
  host: string;
  // API_URL = 'http://localhost:8080/api';

  constructor(
    public httpPro: HttpProvider,
    protected app: App,
  ) {
  }
  // 获取数据
  public fetchInitData (params: any) {
    return this.httpPro.httpPostWithAuth('/data', params);
  }

  // 用户订单
  public fetchUserOrderData (params: any) {
    return this.httpPro.httpPostWithAuth('/orderList', params);
  }

  // 用户创建订单
  public createOrder (params: any) {
    return this.httpPro.httpPostWithAuth('/order', params);
  }

  // 获取逾期未取餐数据
  public fetchOverDueData (params: any) {
    return this.httpPro.httpPostWithAuth('/notTakingMeals', params);
  }

  // 获取历史用餐记录
  public fetchRecordListData (params: any) {
    return this.httpPro.httpPostWithAuth('/consumptionList', params);
  }

  // 获取待消费列表数据
  public fetchWaitingListData (params: any) {
    return this.httpPro.httpPostWithAuth('/canBeConsumed', params);
  }

  // 获取工厂列表数据
  public fetchFactoryListData () {
    return this.httpPro.httpPostWithAuth('/officeTree', null);
  }

  // 获取个人信息
  public fetchPersonInfoData (params: any) {
    return this.httpPro.httpPostWithAuth('/userData', params);
  }

  // 登录
  public checkLogin (params: any) {
    return this.httpPro.httpPostNoAuth('/sign', params);
  }

  // 轮询是否有新消息
  public fetchHasMessage (params: any) {
    return this.httpPro.httpPostWithAuth('/unreadMessage', params);
  }

  // 查询未读信息列表
  public fetchMessageListData (params: any) {
    return this.httpPro.httpPostWithAuth('/unreadMessage', params);
  }

  // 修改消息状态
  public changeMessageStatus (params: any) {
    return this.httpPro.httpPostWithAuth('/readMessage', params);
  }

  // 查询未读信息列表
  public fetchAllMessageData (params: any) {
    return this.httpPro.httpPostWithAuth('/historicalNews', params);
  }

  // 获取APP最新版本
  public checkAppUpdate (params: any) {
    return this.httpPro.httpPostNoAuth('/appVersion', params);
  }

  // 退订
  public unsubscribeOrder (params: any) {
    return this.httpPro.httpPostWithAuth('/unsubscribe', params);
  }

  // 打包
  public pack (params: any) {
    return this.httpPro.httpPostWithAuth('/pack', params);
  }

  // 留餐
  public hold (params: any) {
    return this.httpPro.httpPostWithAuth('/hold', params);
  }
  // 获取反馈初始化信息
  public fetchFeedBackInfo (params: any) {
    return this.httpPro.httpPostWithAuth('/initFeedback', params);
  }

  // 调用微信支付
  public doWxPay (params: any) {

    // TODO
    return this.httpPro.httpGetNoAuth('http://dhpay.feelingys.com/Wechatpay/apppay', params);
  }
}
