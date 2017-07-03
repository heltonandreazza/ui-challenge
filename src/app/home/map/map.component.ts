import { Component, OnInit } from '@angular/core';
import { MapsAPILoader } from "@agm/core";
import { HomeService } from "../home.service";

@Component({
  selector: 'test',
  template: ``
})
class TestComponent {
  text: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  //locations from service
  websiteLocation: any;
  myLocation: any;
  //map parameters
  zoom: number;
  latitude: number;
  longitude: number;
  latlngBounds: any;
  markers: any[] = [];

  constructor(private mapsAPILoader: MapsAPILoader, private homeService: HomeService) {
  }

  /**
   * Fit map bounds based on a list of markers
   */
  mapFitBouds(markers) {
    if (!markers) return;
    //clear values so the listener get the changes
    this.latitude = 0;
    this.longitude = 0;
    this.zoom = 0;

    if (markers.length <= 1) return;

    //fit bouds
    let map = window['google'].maps;
    this.latlngBounds = new map.LatLngBounds();
    markers.forEach(location => {
      this.latlngBounds.extend(new map.LatLng(location.latitude, location.longitude))
    });
  }

  /**
   * Center map based on point location param
   * @param point - point location
   * @param zoom - zoom location
   */
  mapSetCenter({ latitude = 0, longitude = 0, zoom = 8 }) {
    //reset latitude, longitude and zoom
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = zoom;
  }

  ngOnInit() {
    //get my location when it changes
    this.homeService.myLocationChanged
      .subscribe(myLocation => {
        this.myLocation = myLocation;
        this.pushMarker(this.myLocation);
      });
    //get website location when it changes
    this.homeService.websiteLocationChanged
      .subscribe(websiteLocation => {
        this.websiteLocation = websiteLocation;
        this.pushMarker(this.websiteLocation);
      });
    //remove my location when it changes
    this.homeService.removeMyLocationChanges
      .subscribe(() => {
        this.removeMyLocationMarker();
      });

    this.mapsAPILoader.load()
      .then(() => {
        this.mapFitBouds(this.markers);
      });
  }

  /**
   * Remove my location marker
   */
  removeMyLocationMarker() {
    let index = this.markers.findIndex(item => item.label == HomeService.MY_LOCATION_LABEL);
    if (index > -1)
      this.markers.splice(index, 1);

    this.mapFitBouds(this.markers);
    if (this.markers.length == 1) {
      this.mapSetCenter(this.markers[0]);
    }
  }

  /**
   * Push a marker into the map
   * @param point - point marker
   */
  pushMarker(point) {
    // always remove before push so changing website works
    if (point.isWebsite)
      this.markers = this.markers.filter(item => !item.isWebsite);

    if (!this.markers.some(item => item.label == point.label)) {
      this.markers.push(point);
    }

    this.mapFitBouds(this.markers);
    if (this.markers.length == 1) {
      this.mapSetCenter(this.markers[0]);
    }
  }
}
