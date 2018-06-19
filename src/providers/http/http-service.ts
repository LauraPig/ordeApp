import {Injectable, Injector} from '@angular/core';
import {Headers, RequestOptions, Response, Http} from '@angular/http';
import {App, ToastController} from 'ionic-angular';
import { HOST } from '../../common/config';
// import { API } from '../../API/api';

import 'rxjs/add/operator/toPromise';


@Injectable()
export class HttpProvider {
  host: string;
  // API_URL = 'http://localhost:8080/api';

  constructor(
    private http: Http,
    private toastCtrl: ToastController,
    protected injector: Injector,
    protected app: App,
    // private storage: Storage,
  ) {
  }

  public httpGetNoAuth(url: string, body: any) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
    // headers.set('token', `111`);
    let options = new RequestOptions({
      headers,
      params: body,
      // method: 'GET'
    });
    return this.http.get(url, options).toPromise()
      .then(this.extractData)
      .catch(err => this.handleError(err));
  }

  //  post 不带token
  public httpPostNoAuth(url: string, body: any) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
    // headers.set('token', `111`);
    let options = new RequestOptions({
      headers,
      method: 'POST'
    });
    return this.http.post(HOST + url, body, options).toPromise()
      .then(this.extractData)
      .catch(err => this.handleError(err));
  }

  //  post 带有token
  public httpPostWithAuth(url: string, body: any) {
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('token', `111`);
    let options = new RequestOptions({
      headers,
      method: 'POST'
    });
    return this.http.post(HOST + url, body, options).toPromise()
      .then(this.extractData)
      .catch(err => this.handleError(err));
  }


  private extractData(res: Response) {
    return res.text() ? res.json() : {};
  }

  private handleError(error: Response | any): Promise<any> {
    console.log(error);

    if (error.status == 200) {
      return Promise.resolve("success");
    }

    let msg = error.text ? error.json().message : '请求地址错误';

    if (error.status == 400) {
      // this.app.getActiveNav().push('login-default');
      this.app.getRootNav().push('login-default');
    }

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle',
      // cssClass: 'my-toast my-toast-error'
    });

    toast.present();

    return Promise.reject(msg);
    // return Observable.throw(msg);
  }
}
