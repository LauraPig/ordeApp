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
}
