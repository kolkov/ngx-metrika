# Angular Yandex Metrika

A simple Yandex Mertika [tag.js](https://yandex.ru/support/metrika/) package for Angular 6+. 

## Install

```
npm install @kolkov/ngx-metrika --save
```

Add the package to your `app.module.ts`.
Then add property `yaCounterId` to the `environment` constant

```ts
import { NgxMetrikaModule } from '@kolkov/ngx-metrika';

@NgModule({
  imports: [
    NgxMetrikaModule.forRoot({id: environment.yaCounterId, trackPageViews: true})
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
this.ym.reachGoal.emit({'TARGET_NAME'})
```

You can optionally pass in addtional params.


```ts
this.ym.reachGoal.emit({'login', { 
  method: 'Instagram',
  event_category: 'engagemnt',
  event_label: 'New user logged in via OAuth'
}});
```


## Target Directive

Many analytics events are tracked based on user interaction, such as button clicks. Just tell it which DOM event to track.  

```html
<button ymTarget trackOn="click">Track Me</button>
```

This will register a general Target in Yandex Metrika based on the target name.

You can pass optional params to the directive like so:

```html
<div ymTarget
     trackOn="dragstart" 
     action="product_dragged"
     category="ecommerce" 
     [params]="{ event_label: 'Something cool just happened' }">

   Some Product...
   
</div>
```

The directive will produce the following event on dragstart. 
