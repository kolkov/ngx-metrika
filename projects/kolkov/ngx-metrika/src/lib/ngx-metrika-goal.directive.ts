import {NgxMetrikaService} from './ngx-metrika.service';
import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {MetrikaGoalEventOptions} from './interfaces';

@Directive({
  selector: '[ymGoal]'
})
export class NgxMetrikaGoalDirective implements AfterViewInit {
  @Input() trackOn: string;
  @Input() target: string;
  @Input() params: any;
  @Input() callback: () => void;

  constructor(
    private ym: NgxMetrikaService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
  }

  ngAfterViewInit() {
    try {
      this.renderer.listen(this.el.nativeElement, this.trackOn, () => {
        const goalOptions: MetrikaGoalEventOptions = {
          target: this.target || this.trackOn,
          options: {
            callback: this.callback,
            ...this.params
          }
        };
        this.ym.reachGoal.next(goalOptions);
      });
    } catch (err) {
      console.error(err);
    }
  }
}
