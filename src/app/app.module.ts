import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AboutComponent } from './components/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { productsReducer } from './store/products/products.reducer';
import { productsCategoriesReducer } from './store/productCategories/productCategories.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProductsEffects } from './store/products/products.effects';
import { ProductsCategoriesEffects } from './store/productCategories/productCategories.effects';
import { commonReducer } from './store/common/common.reducer';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductThumbComponent } from './components/product-thumb/product-thumb.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { cartReducer } from './store/cart/cart.reducer';
import { ModalModule } from './components/_modal';
import { SearchPipe } from './pipes/search.pipe';
import { ToastrModule } from 'ngx-toastr';
import { TransakcijeComponent } from './components/transakcije/transakcije.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ProductListComponent,
    AboutComponent,
    ProductDetailComponent,
    ProductThumbComponent,
    SearchPipe,
    TransakcijeComponent,
    ProductManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ModalModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    StoreModule.forRoot(
      {
        common: commonReducer,
        products: productsReducer,
        productCategories: productsCategoriesReducer,
        cart: cartReducer
      },
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([ProductsEffects, ProductsCategoriesEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
