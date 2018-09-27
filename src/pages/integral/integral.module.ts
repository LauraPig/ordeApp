import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntegralPage } from './integral';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    // IntegralPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(IntegralPage),
  ],
})
export class IntegralPageModule {}
