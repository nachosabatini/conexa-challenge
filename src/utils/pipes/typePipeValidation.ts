/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TypeValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessage = this.formatErrors(errors);
      throw new BadRequestException(errorMessage);
    }

    this.checkForUnknownFields(value, new metatype());

    return value;
  }

  private formatErrors(errors: ValidationError[]): string {
    return errors
      .map((error) => this.getErrorConstraints(error))
      .flat()
      .join(', ');
  }

  private getErrorConstraints(error: ValidationError, property = ''): string[] {
    const constraints = error.constraints
      ? Object.values(error.constraints).map((constraint) =>
          property ? `${property}.${constraint}` : constraint,
        )
      : [];

    const nestedConstraints = error.children
      ? error.children
          .map((childError) =>
            this.getErrorConstraints(childError, error.property),
          )
          .flat()
      : [];

    return [...constraints, ...nestedConstraints];
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private checkForUnknownFields(value: any, instance: any) {
    const dtoProperties = Object.getOwnPropertyNames(instance);
    const unknownProperties = Object.keys(value).filter(
      (property) => !dtoProperties.includes(property),
    );

    if (unknownProperties.length > 0) {
      throw new BadRequestException(
        `Unknown field(s) found: ${unknownProperties.join(', ')}`,
      );
    }
  }
}
