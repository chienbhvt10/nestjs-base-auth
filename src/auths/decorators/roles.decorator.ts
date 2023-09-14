import { SetMetadata } from '@nestjs/common';

export enum ROLE {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export const ROLES_KEY = 'requiredRoles';
export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);
