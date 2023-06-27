import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { RouterModule } from '@angular/router';

//routes

import { app_routing } from "./app.routes";

//servicios


//componentes
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { EventsComponent } from './components/events/events.component';
import { CreateEventsComponent } from './components/create-events/create-events.component';
import { MetamaskComponent } from './components/metamask/metamask.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    InicioComponent,
    TicketsComponent,
    EventsComponent,
    CreateEventsComponent,
    MetamaskComponent,
    

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    app_routing
  
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
