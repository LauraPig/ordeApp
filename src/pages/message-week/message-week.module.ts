import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageWeekPage } from './message-week';

@NgModule({
  declarations: [
    MessageWeekPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageWeekPage),
  ],
})
export class MessageWeekPageModule {}
