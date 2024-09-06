import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollUserDto } from '../dto/enroll-user.dto';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollUser(enrollUserDto: EnrollUserDto) {
    const { userId, classIds } = enrollUserDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if all classes exist
    const classes = await this.prisma.class.findMany({
      where: { id: { in: classIds } },
    });
    if (classes.length !== classIds.length) {
      throw new NotFoundException('One or more classes not found');
    }

    // Enroll the user in all classes in a single transaction
    const enrollment = await this.prisma.user.update({
      where: { id: userId },
      data: {
        classes: {
          connect: classIds.map(id => ({ id })),
        },
      },
      include: { classes: true },
    });

    return enrollment;
  }
}