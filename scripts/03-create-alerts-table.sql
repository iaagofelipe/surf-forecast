-- Create alerts table for email notifications
CREATE TABLE IF NOT EXISTS surf_alerts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  spot_slug VARCHAR(100) NOT NULL,
  min_wave_height DECIMAL(3,1) DEFAULT 0.5,
  max_wave_height DECIMAL(3,1) DEFAULT 5.0,
  max_wind_speed INTEGER DEFAULT 25,
  preferred_wind_directions TEXT[] DEFAULT ARRAY['NE', 'E', 'ENE'],
  min_score INTEGER DEFAULT 60,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_sent_at TIMESTAMP,
  UNIQUE(email, spot_slug)
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_surf_alerts_active ON surf_alerts(active);
CREATE INDEX IF NOT EXISTS idx_surf_alerts_spot ON surf_alerts(spot_slug);
CREATE INDEX IF NOT EXISTS idx_surf_alerts_email ON surf_alerts(email);
