import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { STATUS_STATE } from '@prisma/client';
import { query } from 'express';

export class TaskCreateREQ {
  title: string;
  description: string;
  status: STATUS_STATE;
  dueDate: string;
}

export class TaskUpdateREQ {
  title: string = null;
  description: string = null;
  status: STATUS_STATE = null;
  dueDate: Date = null;
}

export class TaskListREQ {
  status: STATUS_STATE = null;
  sort: 'asc' | 'desc';
}

@Controller(':userId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  @HttpCode(201)
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: TaskCreateREQ,
  ) {
    return this.taskService.create(userId, body);
  }

  @Patch(':id')
  @HttpCode(204)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: TaskUpdateREQ) {
    return this.taskService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.delete(id);
  }

  @Get(':id')
  @HttpCode(200)
  get(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.detail(id);
  }

  @Get('')
  @HttpCode(200)
  list(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: TaskListREQ,
  ) {
    return this.taskService.list(userId, query);
  }
}
