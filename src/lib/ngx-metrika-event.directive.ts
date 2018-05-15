import {NgxMetrikaService} from './ngx-metrika.service';
import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from "@angular/core";
import {MetrikaGoalEventOptions} from "./interfaces";

@Directive({
  selector: '[ymEvent]'
})
export class NgxMetrikaEventDirective implements AfterViewInit {
  @Input() trackOn: string;
  @Input() action: string;
  @Input() category: string;
  @Input() params: any;

  constructor(
    private ym: NgxMetrikaService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
  }

  ngAfterViewInit() {
    try {
      this.renderer.listen(this.el.nativeElement, this.trackOn, () => {
        let goalOptions: MetrikaGoalEventOptions = {
          type: this.action || this.trackOn,
          commonOptions: {
            event_category: this.category,
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
