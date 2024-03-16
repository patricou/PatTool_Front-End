import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEvenementComponent } from './update-evenement.component';

describe('UpdateEvenementComponent', () => {
  let component: UpdateEvenementComponent;
  let fixture: ComponentFixture<UpdateEvenementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEvenementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEvenementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
