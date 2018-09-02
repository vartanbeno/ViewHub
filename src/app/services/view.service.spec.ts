import { TestBed, inject } from '@angular/core/testing';

import { ViewService } from './view.service';
import { HttpClientModule } from '@angular/common/http';

describe('ViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([ViewService], (service: ViewService) => {
    expect(service).toBeTruthy();
  }));
});
