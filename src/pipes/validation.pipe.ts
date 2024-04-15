import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      if (metadata.type === 'body') {
        this.schema.parse(value);
      }
      return value;
    } catch (error) {
      throw new HttpException(
        { statusbar: HttpStatus.BAD_REQUEST, error },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
