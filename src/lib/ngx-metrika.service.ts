import {Inject, Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {CommonOptions, MetrikaHitOptions, NgxMetrikaConfig} from "./interfaces";
import {filter, tap} from "rxjs/operators";
import {YM_CONFIG} from "./ym.token";

declare var Ya: any;

@Injectable({
  providedIn: 'root'
})
export class NgxMetrikaService {
  previousUrl: string;

  constructor(@Inject(YM_CONFIG) private yaConfig: NgxMetrikaConfig,
              private router: Router) {
    if (yaConfig.id) {
      this.insertMetrika(this.yaConfig);
    }
    if (yaConfig.trackPageViews) {
      router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        tap(event => {
          this.hit(this.router.url);
          this.previousUrl = this.router.url;
        })
      )
        .subscribe();
    }
  }

  hit(url: string, options?: MetrikaHitOptions) {
    try {
      const defaults = {
        title: document.title,
        referer: this.previousUrl
      };
      let Ya = NgxMetrikaService.getCounterById(this.yaConfig.id);
      if (typeof Ya !== 'undefined') {
        options = {...defaults, ...options};
        Ya.hit(url, options);
      }

    } catch (err) {
      console.error('Yandex Metrika hit error', err);
    }
  }

  reachGoal(type: string, options: CommonOptions = {}) {
    try {
      let Ya = NgxMetrikaService.getCounterById(this.yaConfig.id);
      if (typeof Ya !== 'undefined') {
        Ya.reachGoal(type, options.params, options.callback, options.ctx);
      }
    } catch (error) {
      console.error('error', error);
      console.warn(`'Event with type [${type}] can\'t be fired because counter is still loading'`)
    }
  }

  insertMetrika(config: NgxMetrikaConfig) {
    const name = 'yandex_metrika_callbacks2';
    window[name] = window[name] || [];
    window[name].push(function () {
      try {
        const a = NgxMetrikaService.getCounterNameById(config.id);// `yaCounter${config.id}`;
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
}
