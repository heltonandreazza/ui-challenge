import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { SearchComponent } from './search.component';
import { HomeService } from "../home.service";

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let dashboardService: HomeService;
  let compiled: any;

  class FakeHomeService {
    validateWebSite(websiteUrl) {
      if (websiteUrl == 'www.g1.com.br')
        return Observable.of(null);
      return Observable.of({ 'website': true });
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SearchComponent],
      providers: [
        { provide: HomeService, useClass: FakeHomeService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shouldn\'t create reactive form and validators before init', () => {
    expect(component.searchForm).toBeUndefined();
  })

  it('should create validators after init', () => {
    fixture.detectChanges();
    expect(component.searchForm.get('website').validator).toBeTruthy();
  })

  it('should create async validators after init', () => {
    fixture.detectChanges();
    expect(component.searchForm.get('website').asyncValidator).toBeTruthy();
  })

  it('should invalidate url website input', () => {
    fixture.detectChanges();
    component.searchForm.get('website').setValue('wwww.g1.com.br');
    component.searchForm.get('website').markAsTouched();
    fixture.detectChanges();
    expect(component.searchForm.get('website').errors.website).toEqual(true);
  })

  it('should validate url website input', () => {
    fixture.detectChanges();
    component.searchForm.get('website').setValue('www.g1.com.br');
    component.searchForm.get('website').markAsTouched();
    fixture.detectChanges();
    expect(component.searchForm.get('website').errors).toBeNull();
  })

  it('button \'Locate website\' should be disabled if website url is invalid', () => {
    fixture.detectChanges();
    component.searchForm.get('website').setValue('wwww.g1.com.br');
    component.searchForm.get('website').markAsTouched();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#locateWebsite')).nativeElement.disabled).toEqual(true);
  })

  it('button \'Locate website\' shouldn\'t be disabled if website url is valid', () => {
    fixture.detectChanges();
    component.searchForm.get('website').setValue('www.g1.com.br');
    component.searchForm.get('website').markAsTouched();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#locateWebsite')).nativeElement.disabled).toEqual(false);
  })

  it('button \'Get my location\' shouldn\'t be disabled weather the website url is invalid or valid', () => {
    fixture.detectChanges();
    component.searchForm.get('website').setValue('www.g1$.com.br');
    component.searchForm.get('website').markAsTouched();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#getMyLocation')).nativeElement.disabled).toEqual(false);

    component.searchForm.get('website').setValue('www.g1.com.br');
    component.searchForm.get('website').markAsTouched();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#getMyLocation')).nativeElement.disabled).toEqual(false);
  })

  it('button \'Reset my location\' shouldn\'t be disabled weather the website url is invalid or valid', () => {
    fixture.detectChanges();
    component.searchForm.get('website').setValue('www.g1$.com.br');
    component.searchForm.get('website').markAsTouched();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#removeMyLocation')).nativeElement.disabled).toEqual(false);

    component.searchForm.get('website').setValue('www.g1.com.br');
    component.searchForm.get('website').markAsTouched();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#removeMyLocation')).nativeElement.disabled).toEqual(false);
  })

});