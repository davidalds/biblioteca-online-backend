import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksModule } from 'src/books/books.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [BooksModule, UsersModule],
  controllers: [LoansController],
  providers: [LoansService, PrismaService],
})
export class LoansModule {}
