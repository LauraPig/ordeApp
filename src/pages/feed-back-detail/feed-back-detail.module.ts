import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedBackDetailPage } from './feed-back-detail';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    FeedBackDetailPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(FeedBackDetailPage),
  ],
})
export class FeedBackDetailPageModule {}
