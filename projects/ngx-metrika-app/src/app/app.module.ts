import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgxMetrikaModule} from '@kolkov/ngx-metrika';
import {HelloComponent} from './hello/hello.component';
import {HomeComponent} from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HelloComponent,
  ],
  imports: [
    BrowserModule,
    NgxMetrikaModule.forRoot({ id: 49142767 }),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
