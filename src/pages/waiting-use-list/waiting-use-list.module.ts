import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaitingUseListPage } from './waiting-use-list';

@NgModule({
  declarations: [
    WaitingUseListPage,
  ],
  imports: [
    IonicPageModule.forChild(WaitingUseListPage),
  ],
})
export class WaitingUseListPageModule {}
