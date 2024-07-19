import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './users.service';

export class UserCreateREQ {
  username: string;
  password: string;
  email: string;
}

export class UserLoginREQ {
  username: string;
  password: string;
}

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  create(@Body() body: UserCreateREQ) {
    return this.userService.create(body);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: UserLoginREQ) {
    return this.userService.login(body);
  }
}
