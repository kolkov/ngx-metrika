import {inject, TestBed} from '@angular/core/testing';

import {NgxMetrikaService} from './ngx-metrika.service';
import {HttpClientModule} from '@angular/common/http';
import {YM_CONFIG} from './ym.token';
import {NgxMetrikaConfig} from './interfaces';
import {NavigationEnd, Router, RouterModule, Scroll} from '@angular/router';
import {of} from 'rxjs';

describe('NgxMetrikaService', () => {

  const NgxConfig: NgxMetrikaConfig = {
    id: 49142767
  };

  const mockRouter = {
    navigate: (commands: any[]) => { Promise.resolve(true); },
    events: of(new Scroll(new NavigationEnd(0, 'dummyUrl', 'dummyUrl'), [0, 0], 'dummyString'))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule],
      providers: [NgxMetrikaService,
        { provide: YM_CONFIG, useValue: NgxConfig },
        { provide: Router, useValue: mockRouter }]
    });
  });

  it('should be created', inject([NgxMetrikaService], (service: NgxMetrikaService) => {
    expect(service).toBeTruthy();
  }));
});
