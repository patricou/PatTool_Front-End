import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IothomeComponent } from './iothome.component';

describe('IothomeComponent', () => {
  let component: IothomeComponent;
  let fixture: ComponentFixture<IothomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IothomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IothomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
