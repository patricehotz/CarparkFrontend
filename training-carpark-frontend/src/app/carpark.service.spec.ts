import { TestBed } from '@angular/core/testing';

import { CarparkService } from './carpark.service';

describe('CarparkService', () => {
  let service: CarparkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarparkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
