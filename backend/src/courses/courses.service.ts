import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Cria um curso associando ao instrutor logado
  async create(createCourseDto: Partial<Course>, instructorId: string): Promise<Course> {
    const instructor = await this.usersRepository.findOne({ where: { id: instructorId } });
    if (!instructor) {
      throw new NotFoundException('Instrutor não encontrado');
    }

    const course = this.coursesRepository.create({
      ...createCourseDto,
      instructor: instructor,
    });

    return this.coursesRepository.save(course) as Promise<Course>;
  }

  // Lista todos os cursos disponíveis na plataforma
  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find({ relations: { instructor: true } });
  }

  // Busca um único curso pelo ID
  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: { instructor: true, modules: { lessons: true } },
    });
    if (!course) {
      throw new NotFoundException(`Curso com id '${id}' não encontrado`);
    }
    return course;
  }

  // Atualiza um curso (somente o dono pode)
  async update(id: string, updateDto: Partial<Course>, instructorId: string): Promise<Course> {
    const course = await this.findOne(id);
    if (course.instructor.id !== instructorId) {
      throw new ForbiddenException('Você não tem permissão para editar este curso.');
    }
    Object.assign(course, updateDto);
    return this.coursesRepository.save(course);
  }

  // Deleta um curso (somente o dono pode)
  async remove(id: string, instructorId: string): Promise<void> {
    const course = await this.findOne(id);
    if (course.instructor.id !== instructorId) {
      throw new ForbiddenException('Você não tem permissão para deletar este curso.');
    }
    await this.coursesRepository.remove(course);
  }
}
