import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, studentId: true, role: true, createdAt: true, updatedAt: true },
    });
  }

  async createUser(userData: { name: string; email: string; studentId: string; password: string }) {
    this.logger.log(`Creating user with email: ${userData.email}`);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          studentId: userData.studentId,
          password: hashedPassword,
        },
      });
      this.logger.log(`User created successfully: ${newUser.email}`);
      return { id: newUser.id, name: newUser.name, email: newUser.email };
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.warn(`Duplicate entry attempt: ${error.meta.target}`);
        throw new ConflictException(`${error.meta.target} already exists`);
      }
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      select: { id: true, name: true, email: true, studentId: true, role: true }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserClasses(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        classes: {
          include: {
            problems: {
              include: {
                problem: true
              }
            }
          }
        }
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.classes.map(cls => ({
      ...cls,
      problems: cls.problems.map(cp => ({
        id: cp.id,
        problem: cp.problem,
        dueDate: cp.dueDate
      }))
    }));
  }
}