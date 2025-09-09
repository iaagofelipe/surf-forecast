-- Seed Ceará surf spots data
INSERT INTO surf_spots (name, city, latitude, longitude, ideal_swell_direction, ideal_wind_direction, break_type, difficulty, description) VALUES
('Taíba', 'São Gonçalo do Amarante', -3.5833, -38.9167, 90, 45, 'beach', 'intermediate', 'Praia famosa com ondas consistentes e boa infraestrutura. Ideal para kitesurf e windsurf.'),
('Paracuru', 'Paracuru', -3.4167, -39.0333, 75, 60, 'beach', 'beginner', 'Praia extensa com ondas suaves, perfeita para iniciantes. Boa para longboard.'),
('Icaraí de Amontada', 'Amontada', -3.0500, -39.8833, 85, 45, 'beach', 'intermediate', 'Destino mundial de kitesurf com ventos constantes e ondas de qualidade.'),
('Canoa Quebrada', 'Aracati', -4.4667, -37.7667, 110, 90, 'beach', 'intermediate', 'Falésias coloridas e ondas consistentes. Ponto turístico famoso do Ceará.'),
('Jericoacoara', 'Jijoca de Jericoacoara', -2.7833, -40.5167, 70, 30, 'beach', 'advanced', 'Paraíso do windsurf e kitesurf com dunas e lagoas. Ventos fortes e ondas técnicas.'),
('Praia do Futuro', 'Fortaleza', -3.7500, -38.4667, 95, 75, 'beach', 'beginner', 'Praia urbana de Fortaleza com boa infraestrutura e ondas para todos os níveis.'),
('Cumbuco', 'Caucaia', -3.6167, -38.7833, 80, 50, 'beach', 'intermediate', 'Praia com dunas móveis, lagoas e boas condições para kitesurf.'),
('Pecém', 'São Gonçalo do Amarante', -3.5500, -38.8500, 85, 60, 'beach', 'intermediate', 'Porto com ondas consistentes e menos movimento turístico.'),
('Lagoinha', 'Paraipaba', -3.2167, -39.4000, 75, 45, 'beach', 'beginner', 'Praia tranquila com coqueiros e ondas suaves, ideal para relaxar.'),
('Morro Branco', 'Beberibe', -4.0833, -37.8833, 100, 80, 'beach', 'intermediate', 'Falésias coloridas e formações rochosas únicas com ondas de qualidade.');

-- Update timestamps
UPDATE surf_spots SET updated_at = CURRENT_TIMESTAMP;
