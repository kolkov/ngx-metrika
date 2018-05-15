import {EventEmitter, Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {
  CommonOptions,
  MetrikaGoalEventOptions,
  MetrikaHitEventOptions,
  MetrikaHitOptions,
  NgxMetrikaConfig
} from "./interfaces";
import {filter, tap} from "rxjs/operators";
import {YM_CONFIG} from "./ym.token";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

declare var Ya: any;

@Injectable({
  providedIn: 'root'
})
export class NgxMetrikaService {
  previousUrl: string;
  private renderer: Renderer2;

  public hit = new EventEmitter<MetrikaHitEventOptions>();
  public reachGoal = new BehaviorSubject<MetrikaGoalEventOptions>({type: 'test'});

  constructor(@Inject(YM_CONFIG) private ymConfig: NgxMetrikaConfig,
              private router: Router,
              rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    console.log(this.ymConfig);
    console.log(ymConfig);
    if (ymConfig.id) {
      console.log(ymConfig);
      this.configure(ymConfig);
    }
  }

  configure(ymConfig: NgxMetrikaConfig) {
    console.log("Configure called");
    this.insertMetrika(this.ymConfig);
    this.checkCounter(this.ymConfig.id)
      .then(x => {
        console.log("hit subscribed");
        this.hit.subscribe((x: MetrikaHitEventOptions) => {
          this.onHit(this.router.url, x.hitOptions);
          console.log("hit called")
        });
        console.log("reachGoal subscribed");
        this.reachGoal.subscribe((x: MetrikaGoalEventOptions) => {
          console.log("reachGoal start calling");
          this.onReachGoal(x.type, x.commonOptions);
          console.log("reachGoal called")
        });
      });
    if (ymConfig.trackPageViews) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          let options: MetrikaHitEventOptions = {
            url: this.router.url
          };
          console.log("router hit.emit called");
          this.hit.emit(options);
          this.previousUrl = this.router.url;
        })
      ).subscribe();
    }
  }

  private onHit(url: string, options?: MetrikaHitOptions) {
    try {
      const defaults = {
        //title: "My App",
        referer: this.previousUrl
      };
      let ya = NgxMetrikaService.getCounterById(this.ymConfig.id);
      if (typeof ya !== 'undefined') {
        console.log("Defaults:", defaults);
        console.log("Options:", options);
        options = {...defaults, ...options};
        console.log("Options after:", options);
        ya.hit(url, options);
      }

    } catch (err) {
      console.error('Yandex Metrika hit error', err);
    }
  }

  private onReachGoal(type: string, options: CommonOptions = {}) {
    try {
      let ya = NgxMetrikaService.getCounterById(this.ymConfig.id);
      console.log("onReachGoal1:", type, options);
      if (typeof ya !== 'undefined') {
        console.log("onReachGoal2:", type, options);
        ya.reachGoal(type, options.params, options.callback, options.ctx);
      }
    } catch (error) {
      console.error('error', error);
      console.warn(`'Event with type [${type}] can\'t be fired because counter is still loading'`)
    }
  }

  private insertMetrika(config: NgxMetrikaConfig) {
    console.log("insertMetrika called");
    const name = 'yandex_metrika_callbacks2';
    window[name] = window[name] || [];
    window[name].push(function () {
      try {
        const a = NgxMetrikaService.getCounterNameById(config.id);
        config.triggerEvent = true;
        config.defer = true;
        config.webvisor = true;
        config.clickmap = true;
        config.trackLinks = true;
        config.accurateTrackBounce = true;
        console.log("Config before init:", config);
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
    console.log("checkCounter called");
    let that = this;
    return new Promise(function (resolve, reject) {
      let counterName = `yacounter${id}inited`;
      that.renderer.listen('document', counterName, () => {
        console.log("checkCounter resolve called");
        resolve({})
      });
    });
  }
}
