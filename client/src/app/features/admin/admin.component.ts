import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { Order } from '../../shared/models/order';
import { AdminService } from '../../core/services/admin.service';
import { OrderParams } from '../../shared/models/orderParams';
import { DialogService } from '../../core/services/dialog.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButton,
    MatIcon,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
    MatLabel,
    MatTooltipModule,
    MatTabsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'action'];
  dataSource = new MatTableDataSource<Order>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  orderParams = new OrderParams();
  totalItems = 0;
  statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending']

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        if (response.data) {
          this.dataSource.data = response.data;
          this.totalItems = response.count;
        }
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onFilterSelect(event: MatSelectChange) {
    this.orderParams.filter = event.value;
    this.orderParams.pageNumber = 1;
    this.loadOrders();
  }

   async openConfirmDialog(id: number) {
     const confirmed = await this.dialogService.confirm(
       'Potvrdite povrat novca',
       'Jeste li sigurni da želite izdati ovaj povrat novca? Ovo se ne može poništiti'
     )

     if (confirmed) this.refundOrder(id);
   }

   refundOrder(id: number) {
     this.adminService.refundOrder(id).subscribe({
       next: order => {
         this.dataSource.data = this.dataSource.data.map(o => o.id === id ? order : o)
       }
     })
  }

  // Kreiranje metode za bosanske rijeci za status
  translateOrderStatus(status: string): string {
    switch(status) {
      case 'All':
        return 'Sve';
      case 'Pending':
        return 'Na čekanju';
      case 'PaymentReceived':
        return 'Plaćanje primljeno';
      case 'PaymentMismatch':
        return 'Plaćanje neuspješno';
      case 'Refunded':
        return 'Refundirano'
      default:
        return status; // Ako se ne podudara status, vratiti zadanu vrijednost
    }
  }
}
