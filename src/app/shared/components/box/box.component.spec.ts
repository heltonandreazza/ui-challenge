import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';

import { BoxComponent } from "./box.component";

@Component({
  selector: 'test',
  template: `
    <app-box [title]="title"></app-box>
    `
})
class TestComponent {
  title: string = 'title';
}

describe('BoxComponent', () => {
  let component: BoxComponent;
  let fixture: ComponentFixture<BoxComponent>;
  let compiled: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive @Input title', () => {
    fixture.detectChanges();
    expect(component.title).toBe('title');
  })
});