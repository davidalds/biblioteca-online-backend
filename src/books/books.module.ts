import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenresModule } from 'src/genres/genres.module';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports: [GenresModule, AuthorsModule],
  controllers: [BooksController],
  providers: [BooksService, PrismaService],
  exports: [BooksService],
})
export class BooksModule {}
