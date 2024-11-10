import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatePasswordComponent } from './initiate-password.component';

describe('InitiatePasswordComponent', () => {
  let component: InitiatePasswordComponent;
  let fixture: ComponentFixture<InitiatePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitiatePasswordComponent]
    });
    fixture = TestBed.createComponent(InitiatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
