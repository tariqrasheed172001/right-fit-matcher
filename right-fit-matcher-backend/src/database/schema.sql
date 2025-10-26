CREATE TABLE IF NOT EXISTS universities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  program_type VARCHAR(50), -- MBA, MS, MSCS, MSDS, PhD
  avg_gmat INT,             -- 0-800
  avg_gpa NUMERIC(3,2),     -- 0.0-4.0
  avg_work_exp NUMERIC(3,1),-- years
  admit_rate NUMERIC(5,4),  -- 0.0 - 1.0 as baseline probability
  score_scale JSONB,        -- optional metadata
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  gmat INT,
  gpa NUMERIC(3,2),
  work_exp NUMERIC(3,1),
  target_program VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS searches (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  query JSONB,
  results JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_universities_program_type ON universities(program_type);
CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_searches_user_id ON searches(user_id);

