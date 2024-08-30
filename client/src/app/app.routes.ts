import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'prodavnica', component: ShopComponent},
    {path: 'prodavnica/:id', component: ProductDetailsComponent},
    {path: 'korpa', component: CartComponent},
    {path: 'blagajna', component: CheckoutComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
