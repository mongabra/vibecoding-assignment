/*
  # E-Learning Platform Schema

  ## Overview
  This migration creates the core schema for an e-learning platform with courses,
  lessons, and user progress tracking.

  ## New Tables

  ### 1. courses
  Stores course information including title, description, instructor, and thumbnail.
  - `id` (uuid, primary key)
  - `title` (text) - Course title
  - `description` (text) - Short course description
  - `full_description` (text) - Detailed course description
  - `instructor` (text) - Instructor name
  - `thumbnail_url` (text) - Course thumbnail image URL
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. lessons
  Stores individual lessons for each course.
  - `id` (uuid, primary key)
  - `course_id` (uuid, foreign key) - References courses table
  - `title` (text) - Lesson title
  - `content` (text) - Lesson content/description
  - `order_index` (integer) - Order of lesson in course
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. user_progress
  Tracks which courses users have completed.
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References auth.users
  - `course_id` (uuid, foreign key) - References courses table
  - `completed` (boolean) - Completion status
  - `completed_at` (timestamptz) - Completion timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Courses and lessons are publicly readable
  - User progress can only be viewed and modified by the owner
  
  ### Policies
  - **courses**: Anyone can read courses (public access)
  - **lessons**: Anyone can read lessons (public access)
  - **user_progress**: 
    - Users can view their own progress
    - Users can insert their own progress records
    - Users can update their own progress records
    - Users can delete their own progress records

  ## Important Notes
  1. Foreign key constraints ensure data integrity
  2. Unique constraint on user_progress prevents duplicate completion records
  3. Default values ensure proper initialization
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  full_description text NOT NULL,
  instructor text NOT NULL,
  thumbnail_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for courses (public read access)
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

-- Policies for lessons (public read access)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (true);

-- Policies for user_progress (user-specific access)
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);