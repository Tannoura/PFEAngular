import { TestBed } from '@angular/core/testing';

import { PlanningEntryService } from './planning-entry.service';

describe('PlanningEntryService', () => {
  let service: PlanningEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
