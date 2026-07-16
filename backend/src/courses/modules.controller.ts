import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('courses')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get(':courseId/modules')
  getModulesByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.getModulesByCourse(courseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Post(':courseId/modules')
  createModule(
    @Param('courseId') courseId: string,
    @Body('title') title: string,
    @Request() req: any,
  ) {
    return this.modulesService.createModule(courseId, req.user.id, title);
  }
}
