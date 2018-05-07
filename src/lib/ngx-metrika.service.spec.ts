import { TestBed, inject } from '@angular/core/testing';

import { NgxMetrikaService } from './ngx-metrika.service';

describe('NgxMetrikaService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxMetrikaService]
    });
  });

  it('should be created', inject([NgxMetrikaService], (service: NgxMetrikaService) => {
    expect(service).toBeTruthy();
  }));
});
