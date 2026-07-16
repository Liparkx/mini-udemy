import { Controller, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Lesson } from './entities/lesson.entity';

@Controller('modules')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Post(':moduleId/lessons')
  createLesson(
    @Param('moduleId') moduleId: string,
    @Body() lessonData: Partial<Lesson>,
    @Request() req: any,
  ) {
    return this.lessonsService.createLesson(moduleId, req.user.id, lessonData);
  }
}
