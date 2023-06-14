import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingManagerComponent } from './parking-manager.component';

describe('ParkingManagerComponent', () => {
  let component: ParkingManagerComponent;
  let fixture: ComponentFixture<ParkingManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkingManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
