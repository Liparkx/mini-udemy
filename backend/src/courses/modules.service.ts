import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { Course } from './entities/course.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private modulesRepository: Repository<Module>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async createModule(courseId: string, instructorId: string, title: string): Promise<Module> {
    const course = await this.coursesRepository.findOne({ 
      where: { id: courseId },
      relations: { instructor: true }
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    // Validação: Impedir que o Instrutor X adicione módulo no Curso do Instrutor Y
    if (course.instructor.id !== instructorId) {
      throw new ForbiddenException('Você não tem permissão para editar este curso');
    }

    const module = this.modulesRepository.create({
      title,
      course,
    });

    return this.modulesRepository.save(module);
  }

  async getModulesByCourse(courseId: string): Promise<Module[]> {
    return this.modulesRepository.find({
      where: { course: { id: courseId } },
      relations: { lessons: true }, // Já traz as aulas daquele módulo junto!
      order: { order: 'ASC' }
    });
  }
}
