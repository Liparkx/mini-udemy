import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Course } from './entities/course.entity';
import { User } from '../users/entities/user.entity';
import { Module as CourseModule } from './entities/module.entity';
import { Lesson } from './entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User, CourseModule, Lesson])],
  controllers: [CoursesController, ModulesController, LessonsController],
  providers: [CoursesService, ModulesService, LessonsService],
})
export class CoursesModule {}
