import { TestBed, inject } from '@angular/core/testing';

import { SubtidderService } from './subtidder.service';

describe('SubtidderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubtidderService]
    });
  });

  it('should be created', inject([SubtidderService], (service: SubtidderService) => {
    expect(service).toBeTruthy();
  }));
});
