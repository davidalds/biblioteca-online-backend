import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GenresService } from 'src/genres/genres.service';
import { BookStatus } from 'src/types/bookStatus';
import { Prisma } from '@prisma/client';
import { AuthorsService } from 'src/authors/authors.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly genres: GenresService,
    private readonly authors: AuthorsService
  ) {}

  async create(createBookDto: CreateBookDto) {
    const allIdsPresent = await Promise.all(
      createBookDto.genres.map(async ({ id }) => await this.genres.findOne(id))
    ).then((arr) => arr.every((v) => v !== null));

    if (!allIdsPresent) {
      throw new NotFoundException(
        'Não foram encontrados gêneros com um ou mais ids informados'
      );
    }

    const checkISBN = await this.findAllByParams(
      '',
      createBookDto.ISBN,
      null,
      0,
      1
    );

    if (checkISBN) {
      throw new ForbiddenException(
        'Já existe um livro cadastrado com o ISBN informado'
      );
    }

    const author = await this.authors.findOne(createBookDto.author.id);

    if (!author) {
      throw new NotFoundException(
        'Não foram encontrados autores com o id informado'
      );
    }

    return this.prisma.book.create({
      data: {
        ...createBookDto,
        genres: {
          connect: createBookDto.genres,
        },
        author: {
          connect: createBookDto.author,
        },
      },
    });
  }

  async findAll(offset: number, limit: number) {
    const books = await this.prisma.book.findMany({
      skip: offset,
      take: limit,
    });

    const total = await this.prisma.book.count();

    return { total, books };
  }

  async findAllByParams(
    title: string,
    ISBN: string,
    status: BookStatus | null,
    offset: number,
    limit: number
  ) {
    const whereObj: Prisma.BookWhereInput = {
      title: {
        contains: title,
        mode: 'insensitive',
      },
      ISBN: {
        contains: ISBN,
      },
    };

    if (status) {
      whereObj['status'] = {
        equals: status,
      };
    }

    const total = await this.prisma.book.count({
      where: {
        ...whereObj,
      },
    });

    const books = await this.prisma.book.findMany({
      skip: offset,
      take: limit,
      where: {
        ...whereObj,
      },
    });

    return { total, books };
  }

  async findOne(id: number) {
    return await this.prisma.book.findUnique({
      where: {
        id,
      },
      include: {
        genres: true,
        author: true,
      },
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const hasBook = await this.findOne(id);

    if (!hasBook) {
      throw new NotFoundException('Livro não encontrado');
    }

    return this.prisma.book.update({
      where: {
        id,
      },
      data: {
        ...updateBookDto,
        genres: {
          connect: updateBookDto.genres,
        },
        author: {
          connect: updateBookDto.author,
        },
      },
    });
  }

  async remove(id: number) {
    const hasBook = await this.findOne(id);

    if (!hasBook) {
      throw new NotFoundException('Livro não encontrado');
    }

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
