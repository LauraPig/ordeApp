import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import {QrCodeComponent} from "./components/index";

@NgModule({
  declarations: [
    QrCodeComponent,
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    QrCodeComponent,
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class SharedModule {}
