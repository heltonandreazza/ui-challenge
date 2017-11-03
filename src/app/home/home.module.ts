import { AgmCoreModule } from "@agm/core";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { HomeComponent } from "./home.component";
import { HomeService } from "./home.service";
import { MapComponent } from "./map/map.component";
import { SearchComponent } from "./search/search.component";
import { WelcomeComponent } from "./welcome/welcome.component";

@NgModule({
  declarations: [
    HomeComponent,
    MapComponent,
    SearchComponent,
    WelcomeComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyD2WoWHsQu8KIfFMvmqzgmFi4rtVlHe04U"
    }),    
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule {
}