import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from "rxjs/Observable";

import { HomeService } from "../home.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // welcome data
  title: string = 'Welcome to the GeoLocation!!';
  description: string = 'GeoLocation is a application for searching and measuring distance between your localtion and other places.';
  // searchForm ref
  searchForm: FormGroup;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.setupFormValidation()
  }

  /**
   * Setting up reactive form validation for avoiding the user to locate a not existing website
   */
  setupFormValidation() {
    this.searchForm = new FormGroup({
      'website': new FormControl(null, [Validators.required, this.invalidWebsite.bind(this)], [this.invalidWebsiteAsync.bind(this)])
    });
  }

  /**
   * Validate the website url based on regex
   * @param control - control which contains the website data
   */
  invalidWebsite(control: FormControl) {
    if (control.value && control.value.match('wwww.'))
      return { 'website': true };
    return null;
  }

  /**
   * Validate the website url async based on getWebSiteLocation() service
   * @param control - control which contains the website data
   */
  invalidWebsiteAsync(control: FormControl): Observable<any> {
    return this.homeService.validateWebSite(control.value);
  }

  /**
   * Retrieves website location based on its url
   * @param websiteUrl - valid website url 
   */
  getWebsiteLocation(websiteUrl) {
    this.homeService.getWebSiteLocation(websiteUrl);
  }

  /**
   * Retrieves user current location
   */
  getMyLocation() {
    this.homeService.getMyLocation();
  }

  /**
   * Send remove my location mark
   */
  removeMyLocation() {
    this.homeService.removeMyLocation();
  }
}
