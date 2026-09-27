-- CareerAI PostgreSQL Database Schema

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    degree VARCHAR(255),
    college VARCHAR(255),
    graduation_year VARCHAR(32),
    target_role VARCHAR(255),
    experience_level VARCHAR(64),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255),
    raw_text TEXT,
    personal_info JSONB,
    education JSONB,
    skills JSONB,
    projects JSONB,
    experience JSONB,
    score JSONB,
    suggestions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    experience_level VARCHAR(64),
    salary_range VARCHAR(64),
    required_skills JSONB,
    preferred_skills JSONB,
    responsibilities JSONB,
    qualifications JSONB,
    summary TEXT,
    raw_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_matches (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    job_id VARCHAR(64) REFERENCES jobs(id) ON DELETE CASCADE,
    overall_match INTEGER,
    matched_skills JSONB,
    partial_skills JSONB,
    missing_skills JSONB,
    match_summary TEXT,
    key_strengths JSONB,
    key_gaps JSONB,
    action_plan JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roadmaps (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    estimated_duration_weeks INTEGER,
    total_hours INTEGER,
    phases JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interviews (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(255) NOT NULL,
    experience VARCHAR(64),
    difficulty VARCHAR(64),
    interview_type VARCHAR(64),
    status VARCHAR(32) DEFAULT 'in_progress',
    questions JSONB,
    answers JSONB,
    overall_score INTEGER,
    report JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS coding_problems (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    difficulty VARCHAR(32) NOT NULL,
    category VARCHAR(64),
    topics JSONB,
    description TEXT,
    examples JSONB,
    constraints JSONB,
    starter_code JSONB,
    sample_test_cases JSONB,
    test_cases JSONB,
    acceptance_rate VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coding_submissions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    problem_id VARCHAR(64) REFERENCES coding_problems(id) ON DELETE CASCADE,
    problem_title VARCHAR(255),
    language VARCHAR(32),
    code TEXT,
    status VARCHAR(64),
    total_passed INTEGER,
    total_tests INTEGER,
    execution_time_ms INTEGER,
    test_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    salary VARCHAR(64),
    job_url TEXT,
    status VARCHAR(64) DEFAULT 'Saved',
    notes TEXT,
    applied_date VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON coding_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user ON interviews(user_id);
