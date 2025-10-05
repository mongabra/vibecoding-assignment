import { useEffect, useState } from 'react';
import { BookOpen, Filter } from 'lucide-react';
import { supabase, Course, UserProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CourseCard } from '../components/CourseCard';

type FilterType = 'all' | 'completed' | 'not-completed';

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('title');

      if (coursesError) throw coursesError;

      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) throw progressError;
        setUserProgress(progressData || []);
      }

      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = (courseId: string) => {
    return userProgress.some(
      (progress) => progress.course_id === courseId && progress.completed
    );
  };

  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return isCompleted(course.id);
    if (filter === 'not-completed') return !isCompleted(course.id);
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Inapakia kozi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white py-16 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Kozi Zetu</h1>
          </div>
          <p className="text-amber-50 text-lg max-w-2xl">
            Gundua mkusanyiko wetu wa kozi zinazofundishwa na wataalam ili kukusaidia kufikia malengo yako ya kielimu na kazi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-600">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} available
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-4 py-2 border border-amber-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
            >
              <option value="all">All Courses</option>
              <option value="completed">Completed</option>
              <option value="not-completed">Not Completed</option>
            </select>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No courses found with the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isCompleted={isCompleted(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
