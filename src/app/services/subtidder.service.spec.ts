import { TestBed, inject } from '@angular/core/testing';

import { SubtidderService } from './subtidder.service';
import { HttpClientModule } from '@angular/common/http';

describe('SubtidderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubtidderService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([SubtidderService], (service: SubtidderService) => {
    expect(service).toBeTruthy();
  }));
});
