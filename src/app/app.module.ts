import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BodyComponent } from "./core/body/body.component";
import { CoreModule } from "./core/core.module";
import { HomeModule } from "./home/home.module";

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    HomeModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}