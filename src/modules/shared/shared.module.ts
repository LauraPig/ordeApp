import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import {QrCodeComponent} from "./components/index";
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    QrCodeComponent,
  ],
  imports: [
    IonicModule,
    TranslateModule,
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
