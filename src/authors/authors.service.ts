import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return await this.prisma.author.create({
      data: {
        ...createAuthorDto,
      },
    });
  }

  async findAll(offset: number, limit: number) {
    const authors = await this.prisma.author.findMany({
      skip: offset,
      take: limit,
    });

    const total = await this.prisma.author.count();

    return { total, authors };
  }

  async findOne(id: number) {
    return await this.prisma.author.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return await this.prisma.author.update({
      where: {
        id,
      },
      data: {
        ...updateAuthorDto,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.author.delete({
      where: {
        id,
      },
    });
  }
}
