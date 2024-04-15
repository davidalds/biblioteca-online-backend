import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from '../constants';
import { AuthType } from '../entities/auth.entity';
import { Reflector } from '@nestjs/core';
import { Auth } from '../decorators/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authLevel = this.reflector.getAllAndOverride(Auth, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (authLevel !== 'PRIVATE') {
      return true;
    }

    const access_token = this.handleHeaderToken(request);

    try {
      const payload: AuthType = await this.jwt.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });
      request['user_type'] = payload.user_type;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }

  handleHeaderToken(req: Request) {
    const headerToken = req.headers.authorization;

    if (headerToken) {
      const token = headerToken.split(' ');

      if (token.length !== 2) {
        throw new BadRequestException('Token mal formatado');
      }

      if (token[0].toLowerCase() !== 'bearer') {
        throw new BadRequestException('Token mal formatado');
      }

      return token[1];
    } else {
      throw new UnauthorizedException('Token não informado');
    }
  }
}
