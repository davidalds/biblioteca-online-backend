import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/types/userRole';

export const Roles = Reflector.createDecorator<UserRole[]>();
