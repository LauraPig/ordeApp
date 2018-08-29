import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailModalPage } from './detail-modal';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    DetailModalPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(DetailModalPage),
  ],
})
export class DetailModalPageModule {}
