import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Course } from '../lib/supabase';

interface CourseCardProps {
  course: Course;
  isCompleted?: boolean;
}

export function CourseCard({ course, isCompleted = false }: CourseCardProps) {
  return (
    <Link to={`/courses/${course.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 hover:border-amber-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {isCompleted && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BookOpen className="h-4 w-4" />
              <span>{course.instructor}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
