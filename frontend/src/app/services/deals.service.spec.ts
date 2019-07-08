import { TestBed } from '@angular/core/testing';

import { DealsService } from './deals.service';

describe('DealsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DealsService = TestBed.get(DealsService);
    expect(service).toBeTruthy();
  });
});
