import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt/dist';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService
  ) {}

  async signIn(createAuthDto: CreateAuthDto) {
    const user = await this.users.findByEmail(createAuthDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordComp = compareSync(createAuthDto.password, user.password);

    if (!passwordComp) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      first_name: user.first_name,
      email: user.email,
      user_type: user.user_type,
    };

    const access_token = await this.jwt.signAsync(payload);

    return { access_token };
  }
}
