import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResultsComponent } from './home-results.component';

describe('HomeResultsComponent', () => {
  let component: HomeResultsComponent;
  let fixture: ComponentFixture<HomeResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
