import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {CommonOptions, MetrikaGoalEventOptions, MetrikaHitEventOptions, MetrikaHitOptions, NgxMetrikaConfig} from './interfaces';
import {filter, tap} from 'rxjs/operators';
import {YM_CONFIG} from './ym.token';
import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {scriptUrl, unwrapScriptUrlForSink} from 'safevalues';

declare var Ya: any;

/** @dynamic */
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
  init = false;
  previousUrl: string;

  private disabled: boolean;
  private renderer: Renderer2;

  public hit = new BehaviorSubject<MetrikaHitEventOptions>({url: '_TEST_'});
  public reachGoal = new BehaviorSubject<MetrikaGoalEventOptions>({target: 'INIT'});

  constructor(
    @Inject(YM_CONFIG) ymConfig: NgxMetrikaConfig,
    private router: Router,
    rendererFactory: RendererFactory2,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    if (ymConfig && ymConfig.id) {
      this.configure(ymConfig);
    }
  }

  static getCounterNameById(id: string | number): string {
    return `yaCounter${id}`;
  }

  static getCounterById(id: any) {
    return window[NgxMetrikaService.getCounterNameById(id)];
  }

  configure(config: NgxMetrikaConfig) {
    config = Object.assign({}, this.defaultConfig, config);
    this.config = config;
    this.insertMetrika(config);
    this.checkCounter(config.id)
      .then(() => {
        this.hit.subscribe((y: MetrikaHitEventOptions) => {
          if (y.url !== '_TEST_') {
            this.onHit(this.router.url, y.hitOptions);
          }
        });
        this.reachGoal.subscribe((y: MetrikaGoalEventOptions) => {
          if (y.target !== 'INIT' || this.init === true) {
            this.onReachGoal(y.target, y.options);
          }
        });
      });
    if (config.trackPageViews) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          const options: MetrikaHitEventOptions = {
            url: this.router.url
          };
          this.hit.next(options);
          this.previousUrl = this.router.url;
        })
      ).subscribe();
    }
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  checkCounter(id: string | number): Promise<any> {
    const that = this;
    return new Promise((resolve) => {
      const counterName = `yacounter${id}inited`;
      that.renderer.listen('document', counterName, () => {
        resolve({});
      });
    });
  }

  private onHit(url: string, options?: MetrikaHitOptions) {
    if (this.disabled) {
      return;
    }
    try {
      const defaults = {
        referer: this.previousUrl
      };
      if (this.debug) {
        console.log('Hit called:', url, defaults, options);
      }
      const ya = NgxMetrikaService.getCounterById(this.config.id);
      if (typeof ya !== 'undefined') {
        const optionsNew = Object.assign(defaults, options);
        if (this.debug) {
          console.log('Hit fired:', url, optionsNew);
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

    const s = unwrapScriptUrlForSink(scriptUrl`https://mc.yandex.ru/metrika/tag.js`);

    const script = this.renderer.createElement("script");
    this.renderer.setProperty(script, "src", s);
    this.renderer.appendChild(this.document.head, script);
    return name;
  }
}
