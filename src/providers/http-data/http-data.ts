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
}
