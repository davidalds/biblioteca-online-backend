import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/functions/exclude';
import { hashSync, genSaltSync } from 'bcryptjs';
import { formatDate } from 'src/functions/formatDate';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hasEmail = await this.findByEmail(createUserDto.email);

    if (hasEmail) {
      throw new ForbiddenException(
        'Já existe um usuário cadastrado com esse e-mail'
      );
    }

    const salt = genSaltSync(10);
    const hash = hashSync(createUserDto.password, salt);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hash,
      },
    });
  }

  async findAll(offset: number, limit: number) {
    const users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
    });
    const total = await this.prisma.user.count();
    const res = users.map((obj) => exclude(obj, ['password']));
    return { total, users: res };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return exclude(user, ['password']);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hasUser = await this.findOne(id);

    if (!hasUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async history(id: number, offset: number, limit: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const total = await this.prisma.loan.count({
      where: {
        userId: id,
      },
    });

    const books = await this.prisma.loan
      .findMany({
        skip: offset,
        take: limit,
        select: {
          book: true,
        },
        where: {
          userId: id,
        },
      })
      .then((res) =>
        res.map(({ book }) => {
          return {
            ...book,
            publication_year: formatDate(book.publication_year),
          };
        })
      );

    return { total, books };
  }
}
