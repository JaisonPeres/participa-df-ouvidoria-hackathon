-- Initialize database for Participa DF
-- This script runs automatically when the postgres container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'America/Sao_Paulo';

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'Database initialized successfully for Participa DF';
END $$;
