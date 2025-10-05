import { useEffect, useState } from 'react';
import { Award, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { supabase, Course, UserProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CourseCard } from '../components/CourseCard';

interface CourseWithProgress extends Course {
  completedAt: string;
}

export function Progress() {
  const [completedCourses, setCompletedCourses] = useState<CourseWithProgress[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProgressData();
  }, [user]);

  const fetchProgressData = async () => {
    if (!user) return;

    try {
      const { data: allCoursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');

      if (coursesError) throw coursesError;

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false });

      if (progressError) throw progressError;

      const completedCourseIds = progressData?.map((p) => p.course_id) || [];
      const completed = (allCoursesData || [])
        .filter((course) => completedCourseIds.includes(course.id))
        .map((course) => {
          const progress = progressData?.find((p) => p.course_id === course.id);
          return {
            ...course,
            completedAt: progress?.completed_at || '',
          };
        });

      setCompletedCourses(completed);
      setTotalCourses(allCoursesData?.length || 0);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Inapakia maendeleo yako...</p>
        </div>
      </div>
    );
  }

  const completionRate = totalCourses > 0 ? (completedCourses.length / totalCourses) * 100 : 0;

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white py-16 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Maendeleo Yangu</h1>
          </div>
          <p className="text-amber-50 text-lg max-w-2xl">
            Fuatilia safari yako ya kujifunza na sherehekea mafanikio yako.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Jumla ya Kozi</p>
            <p className="text-3xl font-bold text-gray-900">{totalCourses}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Zimekamilika</p>
            <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Kiwango cha Kukamilisha</p>
            <p className="text-3xl font-bold text-gray-900">{completionRate.toFixed(0)}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Safari Yako</h2>
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Kozi {completedCourses.length} kati ya {totalCourses} zimekamilika
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kozi Zilizokamilika</h2>

          {completedCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bado hakuna kozi zilizokamilika
              </h3>
              <p className="text-gray-600 mb-6">
                Anza kujifunza na ukamilishe kozi yako ya kwanza kuiona hapa!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map((course) => (
                <div key={course.id}>
                  <CourseCard course={course} isCompleted={true} />
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500 px-2">
                    <Calendar className="h-4 w-4" />
                    <span>Imekamilika {new Date(course.completedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
