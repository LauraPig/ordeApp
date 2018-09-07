import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalInfoPage } from './personal-info';
import {SharedModule} from "../../modules/shared/shared.module";

@NgModule({
  declarations: [
    PersonalInfoPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(PersonalInfoPage),
  ],
})
export class PersonalInfoPageModule {}
