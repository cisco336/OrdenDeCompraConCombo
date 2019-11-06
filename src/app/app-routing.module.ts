import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as constants from './constants/constants';
import { OrdenesCompraComponent } from './pages/ordenes-compra/ordenes-compra.component';
import { DetallesComponent } from './pages/detalles/detalles.component';
import { TrackingComponent } from './pages/tracking/tracking.component';
import { GuiaComponent } from './pages/guia/guia.component';

const routes: Routes = [
  {
    path: constants.links.home + '/?token=kjnojoijoij',
    component: OrdenesCompraComponent
  },
  {
    path: constants.links.details,
    component: DetallesComponent
  },
  {
    path: constants.links.tracking,
    component: TrackingComponent
  },
  {
    path: constants.links.guide,
    component: GuiaComponent
  },
  {
    path: '**',
    redirectTo: '/' + constants.links.home + '/?token=kjnojoijoij',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
