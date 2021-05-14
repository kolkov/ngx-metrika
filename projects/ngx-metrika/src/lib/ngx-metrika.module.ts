import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgxMetrikaConfig} from './interfaces';
import {NgxMetrikaService} from './ngx-metrika.service';
import {YM_CONFIG} from './ym.token';
import {NgxMetrikaGoalDirective} from './ngx-metrika-goal.directive';

@NgModule({
  declarations: [NgxMetrikaGoalDirective],
  exports: [NgxMetrikaGoalDirective],
  imports: []
})
export class NgxMetrikaModule {
  public static forRoot(config?: NgxMetrikaConfig): ModuleWithProviders<NgxMetrikaModule> {
    return {
      ngModule: NgxMetrikaModule,
      providers: [
        NgxMetrikaService,
        { provide: YM_CONFIG, useValue: config }
      ]
    };
  }
}
