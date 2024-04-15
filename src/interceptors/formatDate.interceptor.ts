import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Book } from 'src/books/entities/book.entity';
import { formatDate } from 'src/functions/formatDate';
import { Loan } from 'src/loans/entities/loan.entity';

@Injectable()
export class FormatDateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Book | Loan) => {
        if (!data) {
          return;
        }

        if (this.isBook(data)) {
          if (Array.isArray(data)) {
            return data.map((obj: Book) => this.formatBookData(obj));
          }
          return this.formatBookData(data);
        } else {
          if (Array.isArray(data)) {
            return data.map((obj: Loan) => this.formatLoanData(obj));
          }
          return this.formatLoanData(data);
        }
      })
    );
  }

  isBook(obj: Book | Loan): obj is Book {
    if (Array.isArray(obj)) {
      return (obj[0] as Book).publication_year !== undefined;
    }
    return (obj as Book).publication_year !== undefined;
  }

  formatBookData(data: Book) {
    return {
      ...data,
      publication_year: formatDate(data.publication_year),
    };
  }

  formatLoanData(data: Loan) {
    return {
      ...data,
      loan_date: formatDate(data.loan_date),
      return_date: formatDate(data.return_date),
    };
  }
}
