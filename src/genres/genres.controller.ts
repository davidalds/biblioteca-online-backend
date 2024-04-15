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
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { updateGenreSchema } from './schemas/updateGenreSchema';
import { createGenreSchema } from './schemas/createGenreSchema';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('genres')
@Auth('PRIVATE')
@Roles(['ADMNISTRADOR', 'LEITOR', 'BIBLIOTECARIO'])
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @Roles(['ADMNISTRADOR'])
  @UsePipes(new ZodValidationPipe(createGenreSchema))
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  @Get(':id/books')
  findGenreAndBooks(
    @Param('id', ParseIntPipe) id: number,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number
  ) {
    return this.genresService.findGenreAndBooks(id, offset, limit);
  }

  @Patch(':id')
  @Roles(['ADMNISTRADOR'])
  @UsePipes(new ZodValidationPipe(updateGenreSchema))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto
  ) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @Roles(['ADMNISTRADOR'])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }
}
