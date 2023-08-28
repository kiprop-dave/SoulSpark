import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

type PossibleError = 'ZodError' | 'PrismaError' | 'UnknownError';
type ErrorType = {
  type: PossibleError;
  message: string;
};

export function errorHandler(err: unknown): ErrorType {
  if (err instanceof ZodError) {
    return {
      type: 'ZodError',
      message: err.message,
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      type: 'PrismaError',
      message: err.message,
    };
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      type: 'PrismaError',
      message: err.message,
    };
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      type: 'PrismaError',
      message: err.message,
    };
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return {
      type: 'PrismaError',
      message: err.message,
    };
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      type: 'PrismaError',
      message: err.message,
    };
  }

  return {
    type: 'UnknownError',
    message: 'An unknown error occurred.',
  };
}
