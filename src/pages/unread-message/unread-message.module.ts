import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnreadMessagePage } from './unread-message';

@NgModule({
  declarations: [
    UnreadMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(UnreadMessagePage),
  ],
})
export class UnreadMessagePageModule {}
