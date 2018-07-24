import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedBackDetailPage } from './feed-back-detail';

@NgModule({
  declarations: [
    FeedBackDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedBackDetailPage),
  ],
})
export class FeedBackDetailPageModule {}
