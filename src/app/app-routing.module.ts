import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { TransakcijeComponent } from './components/transakcije/transakcije.component';
import { OrderProductsComponent } from './components/worker/order-products/order-products.component';
import { SellingProductsComponent } from './components/worker/selling-products/selling-products.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'product-detail',
    component: ProductDetailComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'transakcije',
    component: TransakcijeComponent
  },
  {
    path: 'selling-products',
    component: SellingProductsComponent
  },
  {
    path: 'order-products',
    component: OrderProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
