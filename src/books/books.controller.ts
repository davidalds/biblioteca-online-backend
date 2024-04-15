import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { createBookSchema } from 'src/books/schemas/createBookSchema';
import { updateBookSchema } from 'src/books/schemas/updateBookSchema';
import { Roles } from 'src/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { BookStatus } from 'src/types/bookStatus';

@Controller('books')
@Auth('PRIVATE')
@Roles(['LEITOR', 'BIBLIOTECARIO', 'ADMNISTRADOR'])
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createBookSchema))
  @Roles(['BIBLIOTECARIO', 'ADMNISTRADOR'])
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number
  ) {
    return this.booksService.findAll(offset, limit);
  }

  @Get('search')
  findAllBySearch(
    @Query('title') title: string,
    @Query('ISBN') ISBN: string,
    @Query('status') status: BookStatus,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number
  ) {
    return this.booksService.findAllByParams(
      title,
      ISBN,
      status,
      offset,
      limit
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateBookSchema))
  @Roles(['BIBLIOTECARIO', 'ADMNISTRADOR'])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @Roles(['BIBLIOTECARIO', 'ADMNISTRADOR'])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
