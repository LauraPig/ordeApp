import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageDetailModalPage } from './message-detail-modal';

@NgModule({
  declarations: [
    MessageDetailModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageDetailModalPage),
  ],
})
export class MessageDetailModalPageModule {}
