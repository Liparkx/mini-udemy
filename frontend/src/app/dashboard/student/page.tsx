'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    username: string;
  };
}

export default function StudentDashboard() {
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function loadMyCourses() {
      try {
        const data = await fetchApi('/enrollments/my-courses');
        if (data) {
          // O backend retorna um array de Enrollments, o curso fica dentro da propriedade 'course'
          const courses = data.map((enrollment: any) => enrollment.course);
          setEnrolledCourses(courses);
        }
      } catch (error) {
        console.error('Error retrieving my courses:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMyCourses();
  }, [router]);

  return (
    <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Student Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Pick up where you left off.</p>
        </div>
        <Link href="/" className="hidden sm:inline-block bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-semibold py-2 px-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
          Explore More Courses
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
            <span className="text-3xl">📚</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">You are not yet enrolled in any course.</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Explore our catalog and find the perfect course to take the next step.
          </p>
          <Link href="/" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1">
            View Course Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col group">
              <div className="h-40 bg-gradient-to-tr from-purple-200 to-blue-200 dark:from-purple-900/40 dark:to-blue-900/40 flex items-center justify-center relative">
                <span className="text-3xl">📚</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
                  {/* <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" style={{ width: '45%' }}></div> */}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Teacher: {course.instructor?.username || 'Desconhecido'}
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground line-clamp-2">{course.title}</h3>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300"></span>
                  </div>
                  <Link href={`/courses/${course.id}/learn`} className="block w-full text-center bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold py-3 px-4 rounded-xl transition-colors">
                    Open Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
