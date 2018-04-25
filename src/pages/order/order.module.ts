import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderPage } from './order';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    // OrderPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderPage),
    CalendarModule,
  ],
})
export class OrderPageModule {}
