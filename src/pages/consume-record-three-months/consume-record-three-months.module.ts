import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsumeRecordThreeMonthsPage } from './consume-record-three-months';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    ConsumeRecordThreeMonthsPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ConsumeRecordThreeMonthsPage),
  ],
})
export class ConsumeRecordThreeMonthsPageModule {}
