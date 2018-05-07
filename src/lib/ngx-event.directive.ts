import { NgxMetrikaService } from './ngx-metrika.service';
import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from "@angular/core";

@Directive({
  selector: '[ymEvent]'
})
export class NgxEventDirective implements AfterViewInit {
  @Input() trackOn: string;
  @Input() action: string;
  @Input() category: string;
  @Input() params: any;

  constructor(
    private ym: NgxMetrikaService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngAfterViewInit() {
    try {
      this.renderer.listen(this.el.nativeElement, this.trackOn, () => {
        this.ym.reachGoal(this.action || this.trackOn, {
          event_category: this.category,
          ...this.params
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
}
