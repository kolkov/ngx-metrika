import {EventEmitter, Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {
  CommonOptions,
  MetrikaGoalOptions,
  MetrikaHitEventOptions,
  MetrikaHitOptions,
  NgxMetrikaConfig
} from "./interfaces";
import {filter, tap} from "rxjs/operators";
import {YM_CONFIG} from "./ym.token";

declare var Ya: any;

@Injectable({
  providedIn: 'root'
})
export class NgxMetrikaService {
  previousUrl: string;
  private renderer: Renderer2;

  hit = new EventEmitter<MetrikaHitEventOptions>();
  reachGoal = new EventEmitter<MetrikaGoalOptions>();

  constructor(@Inject(YM_CONFIG) private ymConfig: NgxMetrikaConfig,
              private router: Router,
              rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    if (ymConfig.id) {
      this.configure(this.ymConfig);
    }
  }

  configure(ymConfig: NgxMetrikaConfig) {
    this.insertMetrika(this.ymConfig);
    this.checkCounter(this.ymConfig.id)
      .then(x => {
        this.hit.subscribe((x: MetrikaHitEventOptions) => this.onHit(this.router.url, x.hitOptions));
        this.reachGoal.subscribe((x: MetrikaGoalOptions) => this.onReachGoal(x.type, x.commonOptions));
      });
    if (ymConfig.trackPageViews) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          let options: MetrikaHitEventOptions = {
            url: this.router.url
          };
          this.hit.emit(options);
          this.previousUrl = this.router.url;
        })
      ).subscribe();
    }
  }

  private onHit(url: string, options?: MetrikaHitOptions) {
    try {
      const defaults = {
        title: document.title,
        referer: this.previousUrl
      };
      let ya = NgxMetrikaService.getCounterById(this.ymConfig.id);
      if (typeof ya !== 'undefined') {
        options = {...defaults, ...options};
        ya.hit(url, options);
      }

    } catch (err) {
      console.error('Yandex Metrika hit error', err);
    }
  }

  private onReachGoal(type: string, options: CommonOptions = {}) {
    try {
      let ya = NgxMetrikaService.getCounterById(this.ymConfig.id);
      if (typeof ya !== 'undefined') {
        ya.reachGoal(type, options.params, options.callback, options.ctx);
      }
    } catch (error) {
      console.error('error', error);
      console.warn(`'Event with type [${type}] can\'t be fired because counter is still loading'`)
    }
  }

  private insertMetrika(config: NgxMetrikaConfig) {
    const name = 'yandex_metrika_callbacks2';
    window[name] = window[name] || [];
    window[name].push(function () {
      try {
        const a = NgxMetrikaService.getCounterNameById(config.id);
        config.triggerEvent = true;
        window[a] = new Ya.Metrika2(config);
      } catch (e) {
      }
    });

    const n = document.getElementsByTagName('script')[0];
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://mc.yandex.ru/metrika/tag.js';
    const insetScriptTag = () => n.parentNode.insertBefore(s, n);

    if ((window as any).opera === '[object Opera]') {
      document.addEventListener('DOMContentLoaded', insetScriptTag, false);
    } else {
      insetScriptTag();
    }
    return name;
  }

  static getCounterNameById(id: string | number): string {
    return `yaCounter${id}`;
  }

  static getCounterById(id: any) {
    return window[NgxMetrikaService.getCounterNameById(id)];
  }

  checkCounter(id: string | number): Promise<any> {
    let that = this;
    return new Promise(function (resolve, reject) {
      let counterName = `yacounter${id}inited`;
      that.renderer.listen('document', counterName, () => {
        resolve({})
      });
    });
  }
}
