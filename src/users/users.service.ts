import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserCreateREQ, UserLoginREQ } from './users.controller';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: UserCreateREQ) {
    const user = await this.prismaService.user.findFirst({
      where: { username: body.username },
    });
    if (user) throw new ConflictException('Username existed');
    return await this.prismaService.user.create({
      data: body,
      select: { id: true },
    });
  }

  async login(body: UserLoginREQ) {
    const user = await this.prismaService.user.findFirst({
      where: { username: body.username },
      select: { id: true, password: true },
    });

    if (!user) throw new NotFoundException('Cant find username');
    if (user.password != body.password)
      throw new ConflictException('Wrong username or password');
    return {
      id: user.id,
    };
  }
}
