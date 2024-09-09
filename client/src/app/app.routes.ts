import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { emptyCartGuard } from './core/guards/empty-cart.guard';
import { CheckoutSuccessComponent } from './features/checkout/checkout-success/checkout-success.component';
import { OrderComponent } from './features/orders/order.component';
import { OrderDetailedComponent } from './features/orders/order-detailed/order-detailed.component';
import { orderCompleteGuard } from './core/guards/order-complete.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'prodavnica', component: ShopComponent},
    {path: 'prodavnica/:id', component: ProductDetailsComponent},
    {path: 'korpa', component: CartComponent},
    {path: 'blagajna', component: CheckoutComponent, canActivate: [authGuard, emptyCartGuard]},
    {path: 'blagajna/uspjeh', component: CheckoutSuccessComponent, canActivate: [authGuard, orderCompleteGuard]},
    {path: 'narudzbe', component: OrderComponent, canActivate: [authGuard]},
    {path: 'narudzba/:id', component: OrderDetailedComponent, canActivate: [authGuard]},
    {path: 'nalog/prijava', component: LoginComponent},
    {path: 'nalog/registracija', component: RegisterComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
