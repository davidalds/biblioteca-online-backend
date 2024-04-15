import { LoanStatus } from 'src/types/loanStatus';

export class CreateLoanDto {
  bookId: number;
  userId: number;
  loan_date: Date;
  return_date: Date;
  status: LoanStatus;
}
