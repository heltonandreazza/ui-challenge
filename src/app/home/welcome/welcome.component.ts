import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit {
  // welcome data
  title: string = 'Welcome to the GeoLocation!!';
  description: string = 'GeoLocation is a web application for searching your location and any host web site location.';

  constructor() { }

  ngOnInit() {
  }
}
