import { Controller, Post, Get, Patch, Delete, Param, Body, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Qualquer pessoa pode listar os cursos
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  // Qualquer pessoa pode ver os detalhes de um curso
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  // Apenas INSTRUCTORS podem criar novos cursos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Post()
  create(@Body() createCourseDto: any, @Request() req: any) {
    return this.coursesService.create(createCourseDto, req.user.id);
  }

  // Apenas o INSTRUCTOR dono do curso pode editar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any, @Request() req: any) {
    return this.coursesService.update(id, updateDto, req.user.id);
  }

  // Apenas o INSTRUCTOR dono do curso pode deletar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.coursesService.remove(id, req.user.id);
  }
}
