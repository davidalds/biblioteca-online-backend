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
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { createLoanSchema } from './schemas/createLoanSchema';
import { updateLoanSchema } from './schemas/updateLoanSchema';
import { Roles } from 'src/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CloseLoan } from './dto/close-loan-dto';
import { closeLoanSchema } from './schemas/closeLoanSchema';

@Controller('loans')
@Auth('PRIVATE')
@Roles(['LEITOR', 'BIBLIOTECARIO', 'ADMNISTRADOR'])
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createLoanSchema))
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.create(createLoanDto);
  }

  @Get()
  findAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number
  ) {
    return this.loansService.findAll(offset, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateLoanSchema))
  @Roles(['BIBLIOTECARIO', 'ADMNISTRADOR'])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoanDto: UpdateLoanDto
  ) {
    return this.loansService.update(id, updateLoanDto);
  }

  @Delete(':id')
  @Roles(['BIBLIOTECARIO', 'ADMNISTRADOR'])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.remove(id);
  }

  @Patch(':id/close')
  @Roles(['BIBLIOTECARIO', 'ADMNISTRADOR'])
  @UsePipes(new ZodValidationPipe(closeLoanSchema))
  closeLoan(
    @Param('id', ParseIntPipe) id: number,
    @Body() closeLoan: CloseLoan
  ) {
    return this.loansService.closeLoan(id, closeLoan);
  }
}
