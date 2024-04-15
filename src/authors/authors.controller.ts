import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { CreateAuthorSchema } from './schemas/createAuthorSchema';
import { UpdateAuthorSchema } from './schemas/updateAuthorSchema';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('authors')
@Auth('PRIVATE')
@Roles(['LEITOR', 'BIBLIOTECARIO', 'ADMNISTRADOR'])
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @Roles(['BIBLIOTECARIO', 'ADMNISTRADOR'])
  @UsePipes(new ZodValidationPipe(CreateAuthorSchema))
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  findAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number
  ) {
    return this.authorsService.findAll(offset, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authorsService.findOne(id);
  }

  @Patch(':id')
  @Roles(['BIBLIOTECARIO', 'ADMNISTRADOR'])
  @UsePipes(new ZodValidationPipe(UpdateAuthorSchema))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthorDto: UpdateAuthorDto
  ) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @Roles(['ADMNISTRADOR'])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authorsService.remove(id);
  }
}
