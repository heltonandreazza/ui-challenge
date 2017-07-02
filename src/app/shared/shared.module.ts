import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EchoPipe } from './echo.pipe';
import { BoxComponent } from "./components/box/box.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";

@NgModule({
  declarations: [
    BoxComponent,
    EchoPipe,
    WelcomeComponent
  ],
  exports: [
    BoxComponent,
    CommonModule,
    EchoPipe,
    WelcomeComponent
  ]
})
export class SharedModule {}