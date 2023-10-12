import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    InicioComponent,
    TicketsComponent,
    EventsComponent,
    CreateEventsComponent,
    MetamaskComponent
} from "./components/index.paginas";

const app_routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'tickets', component: TicketsComponent },
    { path: 'events', component: EventsComponent },
    { path: 'createEvents', component: CreateEventsComponent },
    { path: 'metamask', component: MetamaskComponent },
    { path: '**', pathMatch: 'full', redirectTo: ''}


];

@NgModule({
    imports: [RouterModule.forRoot(app_routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

export const app_routing = RouterModule.forRoot(app_routes, { useHash:true });