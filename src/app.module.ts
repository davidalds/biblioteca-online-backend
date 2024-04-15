import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { LoansModule } from './loans/loans.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './users/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { GenresModule } from './genres/genres.module';
import { AuthGuard } from './auth/guards/AuthGuard';
import { AuthorsModule } from './authors/authors.module';
import { AllExceptionFilter } from './filters/all-exception-filter';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    LoansModule,
    AuthModule,
    GenresModule,
    AuthorsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
