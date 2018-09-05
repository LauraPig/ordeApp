import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedBackPage } from './feed-back';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    FeedBackPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(FeedBackPage),
  ],
})
export class FeedBackPageModule {}
