# Angular Yandex Metrika

A simple Yandex Mertika (Яндекс Метрика) [tag.js](https://yandex.ru/support/metrika/) package for Angular 6+. 

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

## Target

[Target](https://yandex.ru/support/metrika/objects/reachgoal.html) expect an action. 

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

## Demo
Demo is here [demo][demo]

Working code for this demo at stackblitz [example](https://stackblitz.com/edit/ngx-metrika)

[npm]: https://www.npmjs.com/
[demo]: https://ngx-metrika.stackblitz.io
[example]: https://stackblitz.com/edit/ngx-metrika

