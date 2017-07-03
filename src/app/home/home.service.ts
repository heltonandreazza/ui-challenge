import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from "rxjs/Subject";

@Injectable()
export class HomeService {
  private url: string = 'http://freegeoip.net/json/';
  public static MY_LOCATION_LABEL = "Me";
  myLocationChanged = new Subject<any>();
  websiteLocationChanged = new Subject<any>();
  removeMyLocationChanges = new Subject<any>();

  constructor(private http: Http) { }

  /**
   * Validate the website url async based on getWebSiteLocation() service
   * @param websiteUrl - website url
   */
  validateWebSite(websiteUrl) {
    return this.http.get(this.url + websiteUrl)
      .map(response => null)
      .catch(error => Observable.of({ 'website': true }));
  }

  /**
   * Retrieves website location based on its url and send to subscribers
   * @param websiteUrl - website url
   */
  getWebSiteLocation(websiteUrl) {
    this.http.get(this.url + websiteUrl)
      .map(response => {
        let location = response.json();
        location.label = websiteUrl;
        location.isWebsite = true;
        return location;
      })
      .catch(error => Observable.throw(error))
      .subscribe(location => {
        this.websiteLocationChanged.next(location);
      });
  }

  /**
   * Retrieves user current location and send to subscribers
   */
  getMyLocation() {
    this.http.get(this.url)
      .map(response => {
        let location = response.json();
        location.label = HomeService.MY_LOCATION_LABEL;
        return location;
      })
      .catch(error => Observable.throw(error))
      .subscribe(location => {
        this.myLocationChanged.next(location);
      });
  }

  /**
   * Send remove my location command to subscribers
   */
  removeMyLocation() {
    this.removeMyLocationChanges.next();
  }
}