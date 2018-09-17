import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import {QrCodeComponent} from "./components/index";
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    QrCodeComponent,  //二维码组件
  ],
  imports: [
    IonicModule,
    TranslateModule,  //国际化模块
    CommonModule
  ],
  exports: [
    QrCodeComponent,
    TranslateModule,
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class SharedModule {}
