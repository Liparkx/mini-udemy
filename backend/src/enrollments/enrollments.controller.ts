import { Controller, Post, Get, Param, Request, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('enrollments')
@UseGuards(JwtAuthGuard) // Todas as rotas de matrícula exigem login
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // Apenas ALUNOS podem se matricular
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post(':courseId')
  enroll(@Param('courseId') courseId: string, @Request() req: any) {
    // req.user.id vem do Token gerado pelo login
    return this.enrollmentsService.enroll(req.user.id, courseId);
  }

  // Apenas ALUNOS podem ver seus próprios cursos
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('my-courses')
  getMyCourses(@Request() req: any) {
    return this.enrollmentsService.getMyCourses(req.user.id);
  }
}
