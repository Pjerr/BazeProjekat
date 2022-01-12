import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AProdavniceComponent } from './components/admin/a-prodavnice/a-prodavnice.component';
import { AProizvodiComponent } from './components/admin/a-proizvodi/a-proizvodi.component';
import { ARadniciComponent } from './components/admin/a-radnici/a-radnici.component';
import { CartComponent } from './components/cart/cart.component';
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
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'a-prodavnice',
    component: AProdavniceComponent
  },
  {
    path: 'a-radnici',
    component: ARadniciComponent
  },
  {
    path: 'a-proizvodi',
    component: AProizvodiComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
