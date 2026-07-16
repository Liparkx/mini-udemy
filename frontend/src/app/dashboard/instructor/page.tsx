'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  price: number;
  instructor?: {
    username: string;
  };
}

export default function InstructorDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'my_courses' | 'all_courses'>('my_courses');
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUsername(payload.username);
    } catch (e) { }
    loadCourses();
  }, [router]);

  async function loadCourses() {
    try {
      const data = await fetchApi('/courses');
      if (data && Array.isArray(data)) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Error retrieving courses:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (courseId: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the course? "${title}"? This action cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(courseId);
    try {
      await fetchApi(`/courses/${courseId}`, { method: 'DELETE' });
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err: any) {
      alert(err.message || 'Error deleting course. Check if you are the owner.');
    } finally {
      setDeletingId(null);
    }
  };

  const displayedCourses = filter === 'my_courses'
    ? courses.filter(c => c.instructor?.username === currentUsername)
    : courses;

  return (
    <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 border-b border-gray-200 dark:border-gray-800 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Instructor Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your courses and create new content for your students.</p>
        </div>
        <Link href="/dashboard/instructor/create-course" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5">
          + Create New Course
        </Link>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFilter('my_courses')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'my_courses' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
        >
          My Courses
        </button>
        <button
          onClick={() => setFilter('all_courses')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all_courses' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
        >
          All Courses
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : displayedCourses.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <span className="text-3xl">📹</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">You don't have any published courses yet.</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Share your knowledge! Create your first course now and reach thousands of students.
          </p>
          <Link href="/dashboard/instructor/create-course" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1">
            Start Teaching
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {displayedCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-foreground">{course.title}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">R$ {Number(course.price).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/instructor/edit-course/${course.id}`}
                      className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      disabled={deletingId === course.id}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      {deletingId === course.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
