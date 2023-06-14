import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingUserComponent } from './parking-user.component';

describe('ParkingUserComponent', () => {
  let component: ParkingUserComponent;
  let fixture: ComponentFixture<ParkingUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkingUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
