import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from 'src/config/role.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useClass: class {
            getAllAndOverride = jest.fn();
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no roles are required', () => {
    const context: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };

    const result = guard.canActivate(context as ExecutionContext);

    expect(result).toEqual(true);
  });

  it('should return true if user has required role', () => {
    const requiredRoles: Role[] = [Role.Admin];
    const context: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { roles: [Role.Admin] },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

    const result = guard.canActivate(context as ExecutionContext);

    expect(result).toEqual(true);
  });

  it('should return false if user does not have required role', () => {
    const requiredRoles: Role[] = [Role.Admin];
    const context: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { roles: [Role.User] },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

    const result = guard.canActivate(context as ExecutionContext);

    expect(result).toEqual(false);
  });
});
