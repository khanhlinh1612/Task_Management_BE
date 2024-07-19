import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { TaskCreateREQ, TaskListREQ, TaskUpdateREQ } from './tasks.controller';
import { PrismaService } from 'src/prisma.service';
import { STATUS_STATE } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: number, body: TaskCreateREQ) {
    return this.prismaService.task.create({
      data: {
        author: { connect: { id: userId } },
        title: body.title,
        description: body.description,
        status: body.status || STATUS_STATE.TODO,
        dueDate: new Date(body.dueDate),
      },
      select: {
        id: true,
      },
    });
  }

  async update(id: number, body: TaskUpdateREQ) {
    const task = this.prismaService.task.findFirst({ where: { id } });
    if (!task) throw new NotFoundException('Cant find task');

    return await this.prismaService.task.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.status && { status: body.status }),
        ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
      },
    });
  }

  async delete(id: number) {
    return await this.prismaService.task.delete({ where: { id } });
  }

  async detail(id: number) {
    return await this.prismaService.task.findFirst({ where: { id } });
  }

  async list(userId: number, query: TaskListREQ) {
    const tasks = this.prismaService.task.findMany({
      where: {
        userId: userId,
        ...(query.status && { status: query.status }),
      },
      orderBy: {
        dueDate: query.sort || 'asc',
      },
    });
    return tasks;
  }
}
