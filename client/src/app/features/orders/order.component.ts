import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  orders: Order[] = [];

  ngOnInit(): void {
    this.orderService.getOrdersForUser().subscribe({
      next: orders => this.orders = orders
    })
  }

  // Kreiranje metode za bosanske rijeci za status
  translateOrderStatus(status: string): string {
    switch(status) {
      case 'Pending':
        return 'Na čekanju';
      case 'PaymentReceived':
        return 'Plaćanje primljeno';
      case 'PaymentFailed':
        return 'Plaćanje neuspješno';
      default:
        return status; // Ako se ne podudara status, vratiti zadanu vrijednost
    }
  }
}
