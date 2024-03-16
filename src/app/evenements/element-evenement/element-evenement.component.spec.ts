import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementEvenementComponent } from './element-evenement.component';

describe('ElementEvenementComponent', () => {
  let component: ElementEvenementComponent;
  let fixture: ComponentFixture<ElementEvenementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ElementEvenementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementEvenementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
