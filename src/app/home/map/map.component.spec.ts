import { AgmCoreModule } from "@agm/core";
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { MapComponent } from './map.component';
import { HomeService } from "../home.service";
import { Subject } from "rxjs/Subject";

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let dashboardService: HomeService;
  let compiled: any;

  //service fake para subs chamada original para API
  class FakeHomeService {
    myLocationChanged = new Subject<any>();
    websiteLocationChanged = new Subject<any>();
    removeMyLocationChanges = new Subject<any>();

    getWebSiteLocation(websiteUrl) {
      if (websiteUrl.match("wwww."))
        return Observable.throw(null);

      if (websiteUrl == "www.nyc.com")
        return Observable.of(fakeWebSiteLocationNYC).subscribe(location => this.websiteLocationChanged.next(location));

      return Observable.of(fakeWebSiteLocationG1).subscribe(location => this.websiteLocationChanged.next(location));
    }

    // method mock no lugar do original para não ter chamada direta para a API
    getMyLocation(websiteUrl) {
      // para retornar fake diretamente sem Subject(myLocationChanged) segue abaixo
      // return Observable.of(fakeMyLocation)
      
      return Observable.of(fakeMyLocation)
        .subscribe(location => this.myLocationChanged.next(location));
    }

    removeMyLocation() {
      this.removeMyLocationChanges.next();
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AgmCoreModule.forRoot({ apiKey: "AIzaSyAFO4MOwHtcRfqfV2MNMWphBAq3cCBgnVA" }),
      ],
      declarations: [MapComponent],
      providers: [
        { provide: HomeService, useClass: FakeHomeService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('service \'Locate website\' should retrieves a website location to the map component by subscription', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getWebSiteLocation('www.g1.com.br');
    fixture.detectChanges();
    expect(component.websiteLocation).toEqual(fakeWebSiteLocationG1);
  })

  //exemplo 
  it('service \'Get my location\' should retrieves the user location to the map component by subscription', () => {
    fixture.detectChanges(); //inicializo constructor do componente
    let homeService = fixture.debugElement.injector.get(HomeService); // injeto service fake(fakeHomeService que retorna mock), veja config de provider la em cima pra substituir o original pelo fake
    homeService.getMyLocation(); // chamo o service back-end pra retornar a mock (fakeHomeService)
    fixture.detectChanges(); // renderizo o componente novamente com os novos dados
    expect(component.myLocation).toEqual(fakeMyLocation); // acesso a propriedade myLocation do componente e vejo que foi carregada pelo service fake. Eu carrego ela no component la no subscribe( veja la o this.homeService.myLocationChanged )
  })


  it('service \'Locate website\' with INVALID website url should not push website location into the map list markers by subscription', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getWebSiteLocation('wwww.g1.com.br');
    fixture.detectChanges();
    expect(component.markers.length).toEqual(0);
  })


  it('service \'Locate website\' with VALID website url should push website location into the map list markers by subscription ', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getWebSiteLocation('www.g1.com.br');
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeWebSiteLocationG1);
  })

  it('service \'Get my location\' should retrieves the user location by subscription and push into the map list markers ', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getMyLocation();
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeMyLocation);
  })

  it('service \'Reset my location\' should retrieves a remove message by subscription and remove user location from the map list markers ', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getMyLocation();
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeMyLocation);

    homeService.removeMyLocation()
    fixture.detectChanges();
    const found = component.markers.find(location => location.label == MY_LOCATION_LABEL);
    expect(found).toBeFalsy();
  })

  it('\'Reset my location\' with NO website located marker should clean up the list markers', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getMyLocation();
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeMyLocation);

    homeService.removeMyLocation()
    fixture.detectChanges();
    expect(component.markers.length).toEqual(0);
  })

  it('\'Reset my location\' with website located should remove the user location and keep the website location ', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getWebSiteLocation('www.g1.com.br');
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeWebSiteLocationG1);

    homeService.getMyLocation();
    fixture.detectChanges();
    expect(component.markers.length).toEqual(2);
    expect(component.markers[1]).toEqual(fakeMyLocation);

    homeService.removeMyLocation()
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeWebSiteLocationG1);
  })

  it('\'Reset my location\' with not user location marker should not change the list markers ', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.removeMyLocation()
    fixture.detectChanges();
    expect(component.markers.length).toEqual(0);
  })

  it('changing the \'Locate website\', by subscription, to a VALID website url should remove the current website from the list markers and add the new one', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getWebSiteLocation('www.g1.com.br');
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeWebSiteLocationG1);

    homeService.getWebSiteLocation('www.nyc.com');
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeWebSiteLocationNYC);
  })

  it('changing the \'Locate website\', by subscription, to a INVALID website url should not change the list markers', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getWebSiteLocation('www.g1.com.br');
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeWebSiteLocationG1);

    homeService.getWebSiteLocation('wwww.g1.com.br');
    fixture.detectChanges();
    expect(component.markers.length).toEqual(1);
    expect(component.markers[0]).toEqual(fakeWebSiteLocationG1);
  })

  it('should be able to render my location marker label and info in the map', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getMyLocation()
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#marker0')).nativeElement).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#infolabel0')).nativeElement.textContent).toEqual(MY_LOCATION_LABEL);
    expect(fixture.debugElement.query(By.css('#infoip0')).nativeElement.textContent).toEqual('ip: ' + fakeMyLocation.ip);
  })

  it('should be able to render website location marker label and info in the map', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getWebSiteLocation('www.g1.com.br');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#marker0')).nativeElement).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#infolabel0')).nativeElement.textContent).toEqual('www.g1.com.br');
    expect(fixture.debugElement.query(By.css('#infoip0')).nativeElement.textContent).toEqual('ip: ' + fakeWebSiteLocationG1.ip);
  })

  it('should be able to render website location and my location marker label and info in the map', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getMyLocation()
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#marker0')).nativeElement).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#infolabel0')).nativeElement.textContent).toEqual(MY_LOCATION_LABEL);
    expect(fixture.debugElement.query(By.css('#infoip0')).nativeElement.textContent).toEqual('ip: ' + fakeMyLocation.ip);

    fixture.detectChanges();
    homeService.getWebSiteLocation('www.g1.com.br');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#marker1')).nativeElement).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#infolabel1')).nativeElement.textContent).toEqual('www.g1.com.br');
    expect(fixture.debugElement.query(By.css('#infoip1')).nativeElement.textContent).toEqual('ip: ' + fakeWebSiteLocationG1.ip);
  })

  it('shouldn\'t be able to render a INVALID website location marker label and info in the map', () => {
    fixture.detectChanges();
    let homeService = fixture.debugElement.injector.get(HomeService);
    homeService.getWebSiteLocation('wwww.g1.com.br');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#marker0'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('#infolabel0'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('#infoip0'))).toBeFalsy();
  })

  //HELPERS
  const MY_LOCATION_LABEL = "Me";

  const fakeWebSiteLocationG1 = {
    "ip": "186.192.90.5",
    "country_code": "BR",
    "country_name": "Brazil",
    "region_code": "",
    "region_name": "",
    "city": "",
    "zip_code": "",
    "time_zone": "",
    "latitude": -22.8305,
    "longitude": -43.2192,
    "metro_code": 0,
    "label": "www.g1.com.br",
    "isWebsite": true
  }

  const fakeWebSiteLocationNYC = {
    "ip": "186.192.90.5",
    "country_code": "BR",
    "country_name": "Brazil",
    "region_code": "",
    "region_name": "",
    "city": "",
    "zip_code": "",
    "time_zone": "",
    "latitude": -22.8305,
    "longitude": -43.2192,
    "metro_code": 0,
    "label": "www.nyc.com",
    "isWebsite": true
  }

  const fakeMyLocation = {
    "ip": "2804:7f5:d180:d257::1",
    "country_code": "BR",
    "country_name": "Brazil",
    "region_code": "SC",
    "region_name": "Santa Catarina",
    "city": "Blumenau",
    "zip_code": "",
    "time_zone": "America/Sao_Paulo",
    "latitude": -26.9156, "longitude": -49.0936, "metro_code": 0,
    "label": MY_LOCATION_LABEL
  }
});