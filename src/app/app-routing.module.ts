import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SellerAuthComponent } from './seller-auth/seller-auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { AuthGuard } from './Auth/auth.guard';
import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { SearchComponent } from './search/search.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyordersComponent } from './myorders/myorders.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'seller-auth',
    component: SellerAuthComponent,
  },
  {
    path: 'seller-home',
    component: SellerHomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'seller-add-product',
    component: SellerAddProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'seller-update-product/:id',
    component: SellerAddProductComponent,
  },
  {
    path: 'search/:query',
    component: SearchComponent,
  },
  {
    path: 'details/:productId',
    component: ProductDetailsComponent,
  },
  {
    path: 'user-auth',
    component: UserAuthComponent,
  },
  {
    path: 'cart-page',
    component: CartPageComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'my-orders',
    component: MyordersComponent,
  },

  // {
  //   path: '**',
  //   component: PageNotFoundComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
