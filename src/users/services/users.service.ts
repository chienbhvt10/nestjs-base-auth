import { Injectable } from '@nestjs/common';
import { ROLE } from 'src/auths/decorators/roles.decorator';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      role: ROLE.ADMIN,
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      role: ROLE.ADMIN,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
