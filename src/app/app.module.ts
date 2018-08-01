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

import { WechatChenyu } from "wechat-chenyu";
import { LocationPage } from "../pages/location/location";
import {BackButtonService} from "../providers/back-button/back-button.service";
import {AppVersion} from "@ionic-native/app-version";
import {MessageRecordPage} from "../pages/message-record/message-record";
import {FileOpener} from "@ionic-native/file-opener";
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import { Diagnostic } from '@ionic-native/diagnostic';
import {NativeService} from "../providers/app-update/NativeService";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SharedModule} from "../modules/shared/shared.module";
import {ImagePicker} from "@ionic-native/image-picker";
import {ImgUploadService} from "../providers/upload/img-upload-service";
import {IntegralPage} from "../pages/integral/integral";

import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

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
    LocationPage,
    MessageRecordPage,
    IntegralPage,
    // WeekMenuTypePage
  ],
  imports: [
    // QRCodeModule,
    HttpModule,
    // QRCodeModule,
    BrowserModule,
    BrowserAnimationsModule,
    ionicGalleryModal.GalleryModalModule,

    IonicModule.forRoot(MyApp, {
      backButtonText: '返回',
      backButtonIcon: 'ios-arrow-back',
      mode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    CalendarModule,
    SharedModule,
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
    LocationPage,
    MessageRecordPage,
    IntegralPage,
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
    BackButtonService,
    ImgUploadService,
    NativeService,
    FileTransferObject,
    SQLite,
    Camera,
    ImagePicker,
    ZBar,
    File,
    AppVersion,
    WechatChenyu,
    FileTransfer,
    FileOpener,
    Diagnostic,
    InAppBrowser,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: ionicGalleryModal.GalleryModalHammerConfig,
    },
  ]
})
export class AppModule {}
