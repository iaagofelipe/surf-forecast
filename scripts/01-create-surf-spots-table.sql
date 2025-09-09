-- Create surf spots table for Ceará beaches
CREATE TABLE IF NOT EXISTS surf_spots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) DEFAULT 'CE',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  ideal_swell_direction INTEGER, -- degrees (0-360)
  ideal_wind_direction INTEGER, -- degrees (0-360)
  break_type VARCHAR(20) DEFAULT 'beach', -- beach, reef, point
  difficulty VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, advanced
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS idx_surf_spots_location ON surf_spots(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_surf_spots_name ON surf_spots(name);
