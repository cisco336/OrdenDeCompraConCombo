import { MatPaginatorIntl } from '@angular/material';
import { paginator } from './constants/constants';

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
  const string = paginator;
  if (length == 0 || pageSize == 0) {
    return `0 ${string.of} ${length}`;
  }
  
  length = Math.max(length, 0);
  
  const startIndex = page * pageSize;
  
  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex =
  startIndex < length
  ? Math.min(startIndex + pageSize, length)
  : startIndex + pageSize;
  
  return `${startIndex + 1} - ${endIndex} ${string.of} ${length}`;
};

export function getSpanishPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  const string = paginator;

  paginatorIntl.itemsPerPageLabel = string.itemsPerPageLabel;
  paginatorIntl.nextPageLabel = string.nextPageLabel;
  paginatorIntl.previousPageLabel = string.previousPageLabel;
  paginatorIntl.firstPageLabel = string.firstPageLabel;
  paginatorIntl.lastPageLabel = string.lastPageLabel;
  paginatorIntl.getRangeLabel = spanishRangeLabel;

  return paginatorIntl;
}
