import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataBaseService } from '../providers/database/database';
import { OperateDataBaseService } from '../providers/database/operate-database';
import { WeekMenuPage } from "../pages/week-menu/week-menu";

import { QRCodeModule } from 'angularx-qrcode';
// import { QRCodeModule } from 'angular2-qrcode';
// import {WeekMenuTypePage} from "../pages/week-menu-type/week-menu-type";
import {OrderPage} from "../pages/order/order";
import {CalendarModule} from "ion2-calendar";
import {WaitingUsePage} from "../pages/waiting-use/waiting-use";
import {SuperTabsModule} from "ionic2-super-tabs";
import {ConsumeRecordPage} from "../pages/consume-record/consume-record";
import {OverduePage} from "../pages/overdue/overdue";
import {LoginPage} from "../pages/login/login";
import {ZBar} from "@ionic-native/zbar";
import {HttpProvider} from "../providers/http/http-service";
import { HttpModule} from "@angular/http";
import {HttpDataProviders} from "../providers/http-data/http-data";
import {SelectTypePage} from "../pages/select-type/select-type";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ItemDetailsPage,
    ListPage,
    WeekMenuPage,
    OrderPage,
    WaitingUsePage,
    ConsumeRecordPage,
    OverduePage,
    LoginPage,
    SelectTypePage,
    // WeekMenuTypePage
  ],
  imports: [
    QRCodeModule,
    HttpModule,
    // QRCodeModule,
    BrowserModule,

    IonicModule.forRoot(MyApp, {
      backButtonText: '返回',
      backButtonIcon: 'ios-arrow-back',
      mode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    CalendarModule,
    // SuperTabsModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ItemDetailsPage,
    ListPage,
    WeekMenuPage,
    OrderPage,
    WaitingUsePage,
    ConsumeRecordPage,
    OverduePage,
    LoginPage,
    SelectTypePage,
    // WeekMenuTypePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataBaseService,
    OperateDataBaseService,
    HttpDataProviders,
    SQLite,
    Camera,
    ZBar,
  ]
})
export class AppModule {}
