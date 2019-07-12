import {EventEmitter, Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {
  CommonOptions,
  MetrikaGoalEventOptions,
  MetrikaHitEventOptions,
  MetrikaHitOptions,
  NgxMetrikaConfig
} from './interfaces';
import {filter, tap} from 'rxjs/operators';
import {YM_CONFIG} from './ym.token';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

declare var Ya: any;

@Injectable({
  providedIn: 'root'
})
export class NgxMetrikaService {
  defaultConfig: NgxMetrikaConfig = {
    id: 0,
    triggerEvent: true,
    trackPageViews: true,
  };
  config: NgxMetrikaConfig;
  debug = false;
  previousUrl: string;
  private renderer: Renderer2;

  public hit = new EventEmitter<MetrikaHitEventOptions>();
  public reachGoal = new BehaviorSubject<MetrikaGoalEventOptions>({target: 'test'});

  constructor(@Inject(YM_CONFIG) private ymConfig: NgxMetrikaConfig,
              private router: Router,
              rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.config = Object.assign(this.defaultConfig, ymConfig);
    if (this.config.id) {
      this.configure(this.config);
    }
  }

  static getCounterNameById(id: string | number): string {
    return `yaCounter${id}`;
  }

  static getCounterById(id: any) {
    return window[NgxMetrikaService.getCounterNameById(id)];
  }

  configure(config: NgxMetrikaConfig) {
    this.insertMetrika(config);
    this.checkCounter(config.id)
      .then(x => {
        this.hit.subscribe((y: MetrikaHitEventOptions) => {
          this.onHit(this.router.url, y.hitOptions);
        });
        this.reachGoal.subscribe((y: MetrikaGoalEventOptions) => {
          this.onReachGoal(y.target, y.options);
        });
      });
    if (config.trackPageViews) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          const options: MetrikaHitEventOptions = {
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
        referer: this.previousUrl
      };
      if (this.debug) {
        console.log('Hit:', url, defaults, options);
      }
      const ya = NgxMetrikaService.getCounterById(this.config.id);
      if (typeof ya !== 'undefined') {
        const optionsNew = Object.assign(defaults, options);
        if (this.debug) {
          console.log('Hit:', url, optionsNew);
        }
        ya.hit(url, optionsNew);
      }
    } catch (err) {
      console.error('Yandex Metrika hit error', err);
    }
  }

  private onReachGoal(type: string, options: CommonOptions = {}) {
    try {
      const ya = NgxMetrikaService.getCounterById(this.config.id);
      if (typeof ya !== 'undefined') {
        if (this.debug) {
          console.log('onReachGoal:', type, options);
        }
        ya.reachGoal(type, options.params, options.callback, options.ctx);
      }
    } catch (error) {
      console.error('error', error);
      console.warn(`'Event with type [${type}] can\'t be fired because counter is still loading'`);
    }
  }

  private insertMetrika(config: NgxMetrikaConfig) {
    const name = 'yandex_metrika_callbacks2';
    window[name] = window[name] || [];
    window[name].push(() => {
      try {
        const a = NgxMetrikaService.getCounterNameById(config.id);
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

  checkCounter(id: string | number): Promise<any> {
    const that = this;
    return new Promise((resolve, reject) => {
      const counterName = `yacounter${id}inited`;
      that.renderer.listen('document', counterName, () => {
        resolve({});
      });
    });
  }
}
