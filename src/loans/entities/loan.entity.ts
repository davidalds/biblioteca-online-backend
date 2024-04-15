import { LoanStatus } from 'src/types/loanStatus';

export class Loan {
  bookId: number;
  userId: number;
  loan_date: Date;
  return_date: Date;
  status: LoanStatus;
}
