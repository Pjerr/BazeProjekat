import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { TransakcijeComponent } from './components/transakcije/transakcije.component';

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
    path: 'control-panel',
    component: ProductManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
