import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageMonthPage } from './message-month';

@NgModule({
  declarations: [
    MessageMonthPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageMonthPage),
  ],
})
export class MessageMonthPageModule {}
