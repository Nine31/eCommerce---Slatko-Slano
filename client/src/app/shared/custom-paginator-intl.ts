import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Proizvoda po stranici:';
  override nextPageLabel = 'Sljedeća stranica';
  override previousPageLabel = 'Prethodna stranica';
  override firstPageLabel = 'Prva stranica';
  override lastPageLabel = 'Posljednja stranica';

    override getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 od ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} – ${endIndex} od ${length}`
    }
}