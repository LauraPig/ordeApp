import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsumeRecordMonthPage } from './consume-record-month';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    ConsumeRecordMonthPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ConsumeRecordMonthPage),
  ],
})
export class ConsumeRecordMonthPageModule {}
