import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from "./home.component";
import { HomeService } from "./home.service";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }