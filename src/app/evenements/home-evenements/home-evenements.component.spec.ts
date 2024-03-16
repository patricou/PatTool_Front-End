import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEvenementsComponent } from './home-evenements.component';

describe('HomeEvenementsComponent', () => {
  let component: HomeEvenementsComponent;
  let fixture: ComponentFixture<HomeEvenementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeEvenementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEvenementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
