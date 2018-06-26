import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LawsRegulationsPage } from './laws-regulations';

@NgModule({
  declarations: [
    LawsRegulationsPage,
  ],
  imports: [
    IonicPageModule.forChild(LawsRegulationsPage),
  ],
})
export class LawsRegulationsPageModule {}
