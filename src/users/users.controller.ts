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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { createUserSchema } from './schemas/createUserSchema';
import { updateUserSchema } from './schemas/updateUserSchema';
import { Roles } from 'src/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
@Auth('PRIVATE')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @Auth('PUBLIC')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(['BIBLIOTECARIO', 'ADMNISTRADOR'])
  findAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number
  ) {
    return this.usersService.findAll(offset, limit);
  }

  @Get(':id')
  @Roles(['ADMNISTRADOR', 'LEITOR', 'BIBLIOTECARIO'])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  @Roles(['ADMNISTRADOR'])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(['ADMNISTRADOR'])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Get(':id/history')
  history(
    @Param('id', ParseIntPipe) id: number,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number
  ) {
    return this.usersService.history(id, offset, limit);
  }
}
