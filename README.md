# Angular Yandex Metrika
[![npm version](https://badge.fury.io/js/%40kolkov%2Fngx-metrika.svg)](https://badge.fury.io/js/%40kolkov%2Fngx-metrika)
[![Build Status](https://travis-ci.org/kolkov/ngx-metrika.svg?branch=master)](https://travis-ci.org/kolkov/ngx-metrika)
[![Coverage Status](https://coveralls.io/repos/github/kolkov/ngx-metrika/badge.svg?branch=master)](https://coveralls.io/github/kolkov/ngx-metrika?branch=master)
[![codecov](https://codecov.io/gh/kolkov/ngx-metrika/branch/master/graph/badge.svg)](https://codecov.io/gh/kolkov/ngx-metrika)

A simple Yandex Mertika (Яндекс Метрика) [tag.js](https://yandex.ru/support/metrika/) package for Angular 6+. 

## Demo
Demo is here [demo][demo]

Working code for this demo at stackblitz [example](https://stackblitz.com/edit/ngx-metrika)

## Install

Install via [npm][npm] package manager

```
npm install @kolkov/ngx-metrika --save
```

Add the package to your `app.module.ts`.
Then simple add property `yaCounterId` to the `environment` constant or use inline

```ts
import { RouterModule } from '@angular/router';
import { NgxMetrikaModule } from '@kolkov/ngx-metrika';

@NgModule({
  imports: [
    RouterModule.forRoot([]),
    NgxMetrikaModule.forRoot({
      id: environment.yaCounterId,
      ...      
      defer: true,
      webvisor: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
    })
  ]
})
```

## Pageviews

The package will listen to route changes by default, you just need to instantiate service in the root of the project. 

```ts
export class AppComponent {
  constructor(private ym: NgxMetrikaService) { }
}
```

NgxMetrika is a service that also allows you to track pageviews manually. 

```ts
this.ym.hit.emit();

// or with custom params

this.ym.hit.emit({url: '/custom',{
  title: 'Lesson Feed',  
  referer: 'https://angularfirebase.com/lessons'
}});
```

## ReachGoal

[ReachGoal](https://yandex.ru/support/metrika/objects/reachgoal.html) expect an action. 

```ts
this.ym.reachGoal.next({target: 'TARGET_NAME'})
```

You can optionally pass in addtional params.

```ts
function goalCallback () {
        console.log('request to Metrika sent successfully');
    }
const options: CommonOptions = {     
         params: {
            productId: product.id,
            productName: product.name,
         },
         callback: goalCallback,
      }
this.ym.reachGoal.next({target: 'ADD_TO_CART', options});
```

## Goal Directive

Many analytics events are tracked based on user interaction, such as button clicks. Just tell it which DOM event to track.  

```html
<button ymGoal trackOn="click">Track Me</button>
```

This will register a general Target in Yandex Metrika based on the target name.

You can pass optional params to the directive like so:

```html
<div ymGoal     
     target="PROGUCT_DRAGGED"     
     [params]="{ targetLabel: 'Something cool just happened' }">

   Some Product...
   
</div>
```

The directive will produce the following event on dragstart. 

## What's included

Within the download you'll find the following directories and files. You'll see something like this:

```
metrika/
└── projects/
    ├── ngx-metrika/
    └── ngx-metrika-app/
```
`ngx-metrika/` - library

`ngx-metrika-app/` - demo application

## Documentation

The documentation for the `ngx-metrika` is hosted at our website [ngx-metrika](https://ngx-metrika.kolkov.ru/)

## Contributing

Please read through our [contributing guidelines](https://github.com/kolkov/ngx-metrika/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

Editor preferences are available in the [editor config](https://github.com/kolkov/ngx-metrika/blob/master/.editorconfig) for easy use in common text editors. Read more and download plugins at <http://editorconfig.org>.

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, `ngx-metrika` is maintained under [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/kolkov/ngx-metrika/releases) for changelogs for each release version.

## Creators

**Andrey Kolkov**

* <https://github.com/kolkov>

[npm]: https://www.npmjs.com/
[demo]: https://ngx-metrika.stackblitz.io
[example]: https://stackblitz.com/edit/ngx-metrika

