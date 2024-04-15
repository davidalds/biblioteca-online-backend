import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { exclude } from 'src/functions/exclude';
import { CloseLoan } from './dto/close-loan-dto';
import { formatDate } from 'src/functions/formatDate';

@Injectable()
export class LoansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly books: BooksService,
    private readonly users: UsersService
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    const user = await this.users.findOne(createLoanDto.userId);
    const book = await this.books.findOne(createLoanDto.bookId);

    if (!user || !book) {
      throw new NotFoundException(
        'Usuário ou livro não encontrado para vincular ao emprestimo'
      );
    }

    if (book.status === 'EMPRESTADO') {
      throw new ForbiddenException(
        'O livro informado já se encontra emprestado'
      );
    }

    return await this.prisma.$transaction([
      this.prisma.loan.create({
        data: {
          ...createLoanDto,
        },
      }),
      this.prisma.book.update({
        where: {
          id: book.id,
        },
        data: {
          status: 'EMPRESTADO',
        },
      }),
    ]);
  }

  async findAll(offset: number, limit: number) {
    const loans = await this.prisma.loan.findMany({
      skip: offset,
      take: limit,
    });

    const total = await this.prisma.loan.count();

    return { total, loans };
  }

  async findOne(id: number) {
    const loan = await this.prisma.loan
      .findUnique({
        where: {
          id,
        },
        include: {
          book: true,
          user: true,
        },
      })
      .then((res) => {
        return {
          ...res,
          loan_date: formatDate(res.loan_date),
          return_date: formatDate(res.loan_date),
        };
      });

    return loan ? { ...loan, user: exclude(loan.user, ['password']) } : loan;
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    const hasLoan = await this.findOne(id);

    if (!hasLoan) {
      throw new NotFoundException('Empréstimo não encontrado');
    }

    return this.prisma.loan.update({
      where: {
        id,
      },
      data: {
        ...updateLoanDto,
      },
    });
  }

  async remove(id: number) {
    const loan = await this.findOne(id);

    if (!loan) {
      throw new NotFoundException('Empréstimo não encontrado');
    }

    return await this.prisma.$transaction([
      this.prisma.loan.delete({
        where: {
          id,
        },
      }),
      this.prisma.book.update({
        where: {
          id: loan.bookId,
        },
        data: {
          status: 'DISPONIVEL',
        },
      }),
    ]);
  }

  async closeLoan(id: number, closeLoan: CloseLoan) {
    const loan = await this.findOne(id);

    if (!loan) {
      throw new NotFoundException('Empréstimo não encontrado');
    }

    if (loan.status === 'FECHADO') {
      throw new ForbiddenException('O empréstimo já se encontra fechado');
    }

    return await this.prisma.$transaction([
      this.prisma.loan.update({
        where: {
          id: loan.id,
        },
        data: {
          status: closeLoan.loanStatus,
        },
      }),
      this.prisma.book.update({
        where: {
          id: loan.bookId,
        },
        data: {
          status: 'DISPONIVEL',
        },
      }),
    ]);
  }
}
