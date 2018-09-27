import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntegralMonthPage } from './integral-month';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    IntegralMonthPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(IntegralMonthPage),
  ],
})
export class IntegralMonthPageModule {}
