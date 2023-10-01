import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '30 days',
      }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByUsername(
      createUserDto.username,
    );

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const user = await this.usersService.create(createUserDto);
    const payload = { username: user.username, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '30 days',
      }),
    };
  }
}
