import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrCodePage } from './qr-code';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    QrCodePage,
  ],
  imports: [
    IonicPageModule.forChild(QrCodePage),
    SharedModule,
  ],
})
export class QrCodePageModule {}
