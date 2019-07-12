import { Component } from '@angular/core';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  name = 'Angular 6 Yandex Metrika';

  constructor(private ym: NgxMetrikaService) {
    ym.debug = true;
  }
}
