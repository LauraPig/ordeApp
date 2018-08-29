import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsumeRecordWeekPage } from './consume-record-week';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    ConsumeRecordWeekPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ConsumeRecordWeekPage),
  ],
})
export class ConsumeRecordWeekPageModule {}
