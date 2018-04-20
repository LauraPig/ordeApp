import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TypeDetailPage } from './type-detail';

@NgModule({
  declarations: [
    TypeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TypeDetailPage),
  ],
})
export class TypeDetailPageModule {}
