import { Reflector } from '@nestjs/core';
import { AuthType } from 'src/types/authTypes';

export const Auth = Reflector.createDecorator<AuthType>();
