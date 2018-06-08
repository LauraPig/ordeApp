import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailModalPage } from './detail-modal';

@NgModule({
  declarations: [
    DetailModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailModalPage),
  ],
})
export class DetailModalPageModule {}
